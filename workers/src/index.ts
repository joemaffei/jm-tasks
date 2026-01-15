import { z } from "zod";

type WireTask = {
  syncId: string;
  deviceId: string;
  title: string;
  description?: string | null;
  status: "todo" | "in-progress" | "done";
  section: "today" | "this-week" | "soon" | "someday";
  order: number;
  originalSection?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string | null;
  deletedAt?: string | null;
  lastSyncedAt?: string | null;
};

const wireTaskSchema = z.object({
  syncId: z.string(),
  deviceId: z.string(),
  title: z.string(),
  description: z.string().nullish(),
  status: z.enum(["todo", "in-progress", "done"]),
  section: z.enum(["today", "this-week", "soon", "someday"]),
  order: z.number(),
  originalSection: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  dueDate: z.string().nullish(),
  deletedAt: z.string().nullish(),
  lastSyncedAt: z.string().nullish(),
});

const pushSchema = z.object({
  deviceId: z.string(),
  changes: z.array(
    z.object({
      type: z.enum(["upsert", "delete"]),
      task: wireTaskSchema,
    })
  ),
});

type PushPayload = z.infer<typeof pushSchema>;

const ALLOWED_METHODS = "GET, POST, OPTIONS";
const ALLOWED_HEADERS = "Content-Type, Authorization";

type Env = {
  SYNC_STORE: DurableObjectNamespace<SyncStore>;
  SYNC_API_TOKEN?: string;
  SYNC_CORS_ORIGINS?: string;
};

function normalizeAllowedOrigins(rawValue?: string): string[] {
  if (!rawValue) {
    return ["*"];
  }

  const trimmed = rawValue.trim();
  if (!trimmed) {
    return ["*"];
  }

  return trimmed
    .split(",")
    .map(value => value.trim())
    .filter(Boolean);
}

function isOriginAllowed(origin: string | null, allowedOrigins: string[]): boolean {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.includes("*")) {
    return true;
  }

  return allowedOrigins.includes(origin);
}

function buildCorsHeaders(
  origin: string | null,
  allowedOrigins: string[]
): Headers {
  const headers = new Headers();
  const allowOrigin = allowedOrigins.includes("*")
    ? "*"
    : origin && allowedOrigins.includes(origin)
      ? origin
      : allowedOrigins[0] ?? "null";

  headers.set("Access-Control-Allow-Origin", allowOrigin);
  headers.set("Access-Control-Allow-Methods", ALLOWED_METHODS);
  headers.set("Access-Control-Allow-Headers", ALLOWED_HEADERS);
  headers.set("Access-Control-Allow-Credentials", "false");
  headers.set("Vary", "Origin");

  return headers;
}

function withCors(response: Response, corsHeaders: Headers): Response {
  const nextHeaders = new Headers(response.headers);
  corsHeaders.forEach((value, key) => nextHeaders.set(key, value));
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: nextHeaders,
  });
}

function jsonResponse(
  data: unknown,
  init: ResponseInit,
  corsHeaders: Headers
): Response {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  return withCors(new Response(JSON.stringify(data), { ...init, headers }), corsHeaders);
}

function parseAuthToken(request: Request): string | null {
  const header = request.headers.get("Authorization")?.trim();
  if (!header) {
    return null;
  }

  const [scheme, token] = header.split(" ");
  if (!scheme || !token || scheme.toLowerCase() !== "bearer") {
    return null;
  }

  return token;
}

function shouldRejectOrigin(
  origin: string | null,
  allowedOrigins: string[]
): boolean {
  return Boolean(origin) && !isOriginAllowed(origin, allowedOrigins);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestId = crypto.randomUUID();
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    const allowedOrigins = normalizeAllowedOrigins(env.SYNC_CORS_ORIGINS);
    const corsHeaders = buildCorsHeaders(origin, allowedOrigins);

    if (shouldRejectOrigin(origin, allowedOrigins)) {
      console.warn(`[sync:${requestId}] Blocked origin`, origin);
      return jsonResponse(
        { error: "Origin not allowed" },
        { status: 403 },
        corsHeaders
      );
    }

    if (request.method === "OPTIONS") {
      return withCors(new Response(null, { status: 204 }), corsHeaders);
    }

    if (!url.pathname.startsWith("/sync/")) {
      return jsonResponse(
        { error: "Not found" },
        { status: 404 },
        corsHeaders
      );
    }

    if (env.SYNC_API_TOKEN) {
      const token = parseAuthToken(request);
      if (token !== env.SYNC_API_TOKEN) {
        return jsonResponse(
          { error: "Unauthorized" },
          { status: 401 },
          corsHeaders
        );
      }
    }

    const id = env.SYNC_STORE.idFromName("primary");
    const stub = env.SYNC_STORE.get(id);

    const response = await stub.fetch(request);
    return withCors(response, corsHeaders);
  },
} satisfies ExportedHandler<Env>;

export class SyncStore implements DurableObject {
  private state: DurableObjectState;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const requestId = crypto.randomUUID();

    try {
      if (request.method === "POST" && url.pathname === "/sync/push") {
        return await this.handlePush(request, requestId);
      }

      if (request.method === "GET" && url.pathname === "/sync/pull") {
        return await this.handlePull(url, requestId);
      }

      if (request.method === "POST" && url.pathname === "/sync/conflict") {
        return await this.handleConflict(request, requestId);
      }

      return jsonResponse(
        { error: "Not found" },
        { status: 404 },
        new Headers()
      );
    } catch (error) {
      console.error(`[sync:${requestId}] Unexpected error`, error);
      return jsonResponse(
        { error: "Internal server error" },
        { status: 500 },
        new Headers()
      );
    }
  }

  private async handlePush(
    request: Request,
    requestId: string
  ): Promise<Response> {
    let body: unknown;

    try {
      body = await request.json();
    } catch (error) {
      console.warn(`[sync:${requestId}] Failed to parse JSON body`, error);
      return jsonResponse(
        { error: "Invalid JSON payload" },
        { status: 400 },
        new Headers()
      );
    }

    const parsed = pushSchema.safeParse(body);

    if (!parsed.success) {
      console.warn(`[sync:${requestId}] Invalid push payload`, parsed.error);
      return jsonResponse(
        { error: "Invalid payload" },
        { status: 400 },
        new Headers()
      );
    }

    const payload = parsed.data;
    let applied = 0;

    for (const change of payload.changes) {
      const nextTask = this.normalizeTask(change.task, change.type);
      const storageKey = this.taskKey(nextTask.syncId);
      const existing = await this.state.storage.get<WireTask>(storageKey);

      if (!existing || isRemoteNewer(nextTask, existing)) {
        await this.state.storage.put(storageKey, nextTask);
        applied += 1;
      }
    }

    console.log(
      `[sync:${requestId}] Applied ${applied} change(s) from device ${payload.deviceId}`
    );

    return jsonResponse({ ok: true, applied }, { status: 200 }, new Headers());
  }

  private async handlePull(
    url: URL,
    requestId: string
  ): Promise<Response> {
    const since = url.searchParams.get("since");
    const sinceDate = since ? new Date(since) : null;

    if (since && (!sinceDate || Number.isNaN(sinceDate.getTime()))) {
      return jsonResponse(
        { error: "Invalid 'since' timestamp" },
        { status: 400 },
        new Headers()
      );
    }

    const results = await this.state.storage.list<WireTask>({
      prefix: "task:",
    });

    const tasks = Array.from(results.values()).filter(task => {
      if (!sinceDate) {
        return true;
      }

      return getLatestTimestamp(task) > sinceDate.getTime();
    });

    console.log(
      `[sync:${requestId}] Returned ${tasks.length} task(s) since ${since ?? "beginning"}`
    );

    return jsonResponse({ tasks }, { status: 200 }, new Headers());
  }

  private async handleConflict(
    request: Request,
    requestId: string
  ): Promise<Response> {
    const body = await request.json().catch(() => null);
    console.warn(`[sync:${requestId}] Conflict payload received`, body);

    return jsonResponse(
      { status: "conflict-received" },
      { status: 200 },
      new Headers()
    );
  }

  private normalizeTask(task: WireTask, type: "upsert" | "delete"): WireTask {
    if (type === "delete") {
      const now = new Date().toISOString();
      return {
        ...task,
        deletedAt: task.deletedAt ?? now,
        updatedAt: task.updatedAt ?? now,
      };
    }

    return task;
  }

  private taskKey(syncId: string): string {
    return `task:${syncId}`;
  }
}

function getLatestTimestamp(task: WireTask): number {
  const deletedAt = parseTimestamp(task.deletedAt);
  if (deletedAt) {
    return deletedAt.getTime();
  }

  const updatedAt = parseTimestamp(task.updatedAt);
  return updatedAt ? updatedAt.getTime() : 0;
}

function parseTimestamp(value?: string | null): Date | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

function isRemoteNewer(incoming: WireTask, existing: WireTask): boolean {
  return getLatestTimestamp(incoming) > getLatestTimestamp(existing);
}
