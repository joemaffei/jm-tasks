import "fake-indexeddb/auto";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { Task } from "@/storage/db";
import { db } from "@/storage/db";

const baseTask = (overrides: Partial<Task> = {}): Task => ({
  id: 1,
  syncId: "sync-1",
  deviceId: "device-1",
  title: "Task",
  status: "todo",
  section: "today",
  order: 0,
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-02T00:00:00.000Z"),
  ...overrides,
});

const jsonResponse = (data: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

const getAuthHeader = (headers?: HeadersInit) => {
  if (!headers) {
    return undefined;
  }

  if (headers instanceof Headers) {
    return headers.get("Authorization") ?? undefined;
  }

  if (Array.isArray(headers)) {
    const match = headers.find(([key]) => key.toLowerCase() === "authorization");
    return match?.[1];
  }

  return headers.Authorization ?? headers.authorization;
};

async function waitFor(predicate: () => Promise<boolean>, timeoutMs = 500, intervalMs = 10) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    if (await predicate()) {
      return;
    }

    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }

  throw new Error("Timed out waiting for condition");
}

async function loadSyncService(env: Record<string, string | undefined>) {
  vi.resetModules();
  Object.entries(env).forEach(([key, value]) => {
    if (typeof value === "undefined") {
      return;
    }

    vi.stubEnv(key, value);
  });

  return await import("./syncService");
}

describe("syncService", () => {
  beforeEach(async () => {
    if (!db.isOpen()) {
      await db.open();
    }

    await db.tasks.clear();
    await db.syncQueue.clear();
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(async () => {
    await db.tasks.clear();
    await db.syncQueue.clear();
    vi.unstubAllEnvs();
  });

  it("disables sync when base URL is missing", async () => {
    const fetchMock = vi.fn();
    globalThis.fetch = fetchMock as any;

    const syncService = await loadSyncService({
      VITE_SYNC_API_BASE_URL: "",
    });

    await syncService.requestSync();

    expect(syncService.getSyncStatusSnapshot().enabled).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("pushes queued changes and updates lastSyncAt", async () => {
    const fetchMock = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url.endsWith("/sync/push")) {
        return Promise.resolve(jsonResponse({ ok: true, applied: 1 }, { status: 200 }));
      }

      if (url.includes("/sync/pull")) {
        return Promise.resolve(jsonResponse({ tasks: [] }, { status: 200 }));
      }

      return Promise.resolve(new Response("Not found", { status: 404 }));
    });
    globalThis.fetch = fetchMock as any;

    const syncService = await loadSyncService({
      VITE_SYNC_API_BASE_URL: "http://localhost:8787",
      VITE_SYNC_API_TOKEN: "test-token",
    });

    const task: Task = baseTask({
      id: undefined,
      syncId: "sync-queued",
      updatedAt: new Date(),
    });
    const id = await db.tasks.add(task);
    const created = await db.tasks.get(id);
    await syncService.enqueueTaskUpsert(created!);
    await syncService.requestSync();

    await waitFor(async () => {
      const queue = await db.syncQueue.toArray();
      return queue.length === 0;
    });

    const syncedTask = await db.tasks.get(id);
    expect(syncedTask?.lastSyncedAt).toBeInstanceOf(Date);
    expect(window.localStorage.getItem("jm-tasks:last-sync-at")).toBeTruthy();

    const pushCall = fetchMock.mock.calls.find(([input]) =>
      (typeof input === "string" ? input : input.toString()).endsWith("/sync/push")
    );
    expect(pushCall).toBeDefined();
    const authHeader = getAuthHeader(pushCall?.[1]?.headers);
    expect(authHeader).toBe("Bearer test-token");
  });

  it("pulls remote changes and updates local tasks", async () => {
    const localTask = baseTask({
      id: undefined,
      syncId: "sync-remote",
      title: "Local",
      updatedAt: new Date("2025-01-01T00:00:00.000Z"),
    });
    const id = await db.tasks.add(localTask);

    const fetchMock = vi.fn((input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url.includes("/sync/pull")) {
        return Promise.resolve(
          jsonResponse(
            {
              tasks: [
                {
                  ...localTask,
                  title: "Remote",
                  updatedAt: "2025-01-05T00:00:00.000Z",
                  createdAt: "2025-01-01T00:00:00.000Z",
                },
              ],
            },
            { status: 200 }
          )
        );
      }

      return Promise.resolve(jsonResponse({ ok: true }, { status: 200 }));
    });
    globalThis.fetch = fetchMock as any;

    const syncService = await loadSyncService({
      VITE_SYNC_API_BASE_URL: "http://localhost:8787",
    });

    await syncService.requestSync();

    const updated = await db.tasks.get(id);
    expect(updated?.title).toBe("Remote");
  });

  it("skips sync when offline", async () => {
    const fetchMock = vi.fn();
    globalThis.fetch = fetchMock as any;

    const syncService = await loadSyncService({
      VITE_SYNC_API_BASE_URL: "http://localhost:8787",
    });

    vi.spyOn(window.navigator, "onLine", "get").mockReturnValue(false);

    await syncService.requestSync();

    expect(syncService.getSyncStatusSnapshot().state).toBe("offline");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
