import type { Task } from "@/storage/db";

export type WireTask = Omit<
  Task,
  "createdAt" | "updatedAt" | "dueDate" | "deletedAt" | "lastSyncedAt"
> & {
  createdAt: string;
  updatedAt: string;
  dueDate?: string | null;
  deletedAt?: string | null;
  lastSyncedAt?: string | null;
};

export function serializeTaskForSync(task: Task): WireTask {
  return {
    ...task,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    deletedAt: task.deletedAt ? task.deletedAt.toISOString() : null,
    lastSyncedAt: task.lastSyncedAt ? task.lastSyncedAt.toISOString() : null,
  };
}

export function parseTaskFromSync(task: WireTask): Task {
  return {
    ...task,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
    dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    deletedAt: task.deletedAt ? new Date(task.deletedAt) : undefined,
    lastSyncedAt: task.lastSyncedAt ? new Date(task.lastSyncedAt) : undefined,
  };
}

export function isRemoteNewer(remote: Task, local: Task): boolean {
  return getLatestTimestamp(remote) > getLatestTimestamp(local);
}

function getLatestTimestamp(task: Task): number {
  const latest = task.deletedAt ?? task.updatedAt;
  return latest.getTime();
}
