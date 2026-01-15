import { db, Task, SyncQueueEntry } from "@/storage/db";
import { getDeviceId } from "@/sync/syncIdentity";
import {
  parseTaskFromSync,
  serializeTaskForSync,
  isRemoteNewer,
  WireTask,
} from "@/sync/syncUtils";

export type SyncState = "idle" | "syncing" | "offline" | "error";

export type SyncStatus = {
  state: SyncState;
  enabled: boolean;
  lastSyncAt?: Date;
  lastError?: string;
};

const SYNC_API_BASE_URL: string = import.meta.env.VITE_SYNC_API_BASE_URL ?? "";
const SYNC_API_TOKEN: string = import.meta.env.VITE_SYNC_API_TOKEN ?? "";
const LAST_SYNC_KEY = "jm-tasks:last-sync-at";

const status: SyncStatus = {
  state: "idle",
  enabled: Boolean(SYNC_API_BASE_URL),
};

const listeners = new Set<(next: SyncStatus) => void>();
let syncing = false;
let syncTimer: number | null = null;

function emitStatus(): void {
  const snapshot = getSyncStatusSnapshot();
  listeners.forEach(listener => listener(snapshot));
}

function setStatus(next: Partial<SyncStatus>): void {
  Object.assign(status, next);
  emitStatus();
}

function getLastSyncAt(): Date | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  const stored = window.localStorage.getItem(LAST_SYNC_KEY);
  if (!stored) {
    return undefined;
  }

  const parsed = new Date(stored);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed;
}

function setLastSyncAt(date: Date): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LAST_SYNC_KEY, date.toISOString());
}

function isOnline(): boolean {
  if (typeof navigator === "undefined") {
    return true;
  }

  return navigator.onLine;
}

export function getSyncStatusSnapshot(): SyncStatus {
  return {
    ...status,
    lastSyncAt: status.lastSyncAt ?? getLastSyncAt(),
  };
}

export function subscribeToSyncStatus(
  listener: (next: SyncStatus) => void
): () => void {
  listeners.add(listener);
  listener(getSyncStatusSnapshot());

  return () => {
    listeners.delete(listener);
  };
}

export async function enqueueTaskUpsert(task: Task): Promise<void> {
  const entry: SyncQueueEntry = {
    type: "upsert",
    taskSyncId: task.syncId,
    payload: task,
    createdAt: new Date(),
  };

  await db.syncQueue.where("taskSyncId").equals(task.syncId).delete();
  await db.syncQueue.add(entry);
  scheduleSync();
}

export async function enqueueTaskDelete(task: Task): Promise<void> {
  const entry: SyncQueueEntry = {
    type: "delete",
    taskSyncId: task.syncId,
    payload: task,
    createdAt: new Date(),
  };

  await db.syncQueue.where("taskSyncId").equals(task.syncId).delete();
  await db.syncQueue.add(entry);
  scheduleSync();
}

export function initializeSync(): void {
  if (!status.enabled) {
    return;
  }

  setStatus({ lastSyncAt: getLastSyncAt() });

  if (typeof window !== "undefined") {
    window.addEventListener("online", () => scheduleSync());
    window.addEventListener("offline", () => setStatus({ state: "offline" }));
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        scheduleSync();
      }
    });
  }

  scheduleSync();
  startSyncLoop();
}

export function requestSync(): Promise<void> {
  return runSync();
}

function startSyncLoop(): void {
  if (syncTimer !== null || typeof window === "undefined") {
    return;
  }

  syncTimer = window.setInterval(() => {
    void runSync();
  }, 30000);
}

function stopSyncLoop(): void {
  if (syncTimer === null || typeof window === "undefined") {
    return;
  }

  window.clearInterval(syncTimer);
  syncTimer = null;
}

function scheduleSync(): void {
  if (!status.enabled) {
    return;
  }

  if (!isOnline()) {
    setStatus({ state: "offline" });
    return;
  }

  void runSync();
}

async function runSync(): Promise<void> {
  if (!status.enabled || syncing) {
    return;
  }

  if (!isOnline()) {
    setStatus({ state: "offline" });
    return;
  }

  syncing = true;
  setStatus({ state: "syncing", lastError: undefined });

  try {
    await pushLocalChanges();
    await pullRemoteChanges();

    const now = new Date();
    setLastSyncAt(now);
    setStatus({ state: "idle", lastSyncAt: now });
  } catch (error) {
    stopSyncLoop();
    setStatus({
      state: "error",
      lastError: error instanceof Error ? error.message : "Sync failed",
    });
  } finally {
    syncing = false;
  }
}

async function pushLocalChanges(): Promise<void> {
  const queue = await db.syncQueue.orderBy("createdAt").toArray();
  if (queue.length === 0) {
    return;
  }

  const payload = {
    deviceId: getDeviceId(),
    changes: queue.map(entry => ({
      type: entry.type,
      task: serializeTaskForSync(entry.payload),
    })),
  };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (SYNC_API_TOKEN) {
    headers.Authorization = `Bearer ${SYNC_API_TOKEN}`;
  }

  const response = await fetch(`${SYNC_API_BASE_URL}/sync/push`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Sync push failed (${response.status})`);
  }

  const syncedAt = new Date();
  await Promise.all(
    queue.map(async entry => {
      await db.tasks
        .where("syncId")
        .equals(entry.taskSyncId)
        .modify({ lastSyncedAt: syncedAt });
    })
  );

  await db.syncQueue.clear();
}

async function pullRemoteChanges(): Promise<void> {
  const lastSyncAt = getLastSyncAt();
  const query = lastSyncAt ? `?since=${lastSyncAt.toISOString()}` : "";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (SYNC_API_TOKEN) {
    headers.Authorization = `Bearer ${SYNC_API_TOKEN}`;
  }

  const response = await fetch(`${SYNC_API_BASE_URL}/sync/pull${query}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(`Sync pull failed (${response.status})`);
  }

  const data = (await response.json()) as { tasks: WireTask[] };
  if (!data?.tasks?.length) {
    return;
  }

  for (const wireTask of data.tasks) {
    const remote = parseTaskFromSync(wireTask);
    const local = await db.tasks.where("syncId").equals(remote.syncId).first();

    if (!local) {
      await db.tasks.add(remote);
      continue;
    }

    if (isRemoteNewer(remote, local)) {
      const { id: _ignored, ...remoteData } = remote;
      await db.tasks.update(local.id!, remoteData);
    }
  }
}
