import { describe, expect, it } from "vitest";
import type { Task } from "@/storage/db";
import {
  isRemoteNewer,
  parseTaskFromSync,
  serializeTaskForSync,
} from "@/sync/syncUtils";

const createTask = (overrides: Partial<Task> = {}): Task => ({
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

describe("syncUtils", () => {
  it("serializes and parses task date fields", () => {
    const task = createTask({
      dueDate: new Date("2025-02-01T12:00:00.000Z"),
      lastSyncedAt: new Date("2025-02-02T12:00:00.000Z"),
    });

    const wire = serializeTaskForSync(task);
    const parsed = parseTaskFromSync(wire);

    expect(parsed.createdAt).toEqual(task.createdAt);
    expect(parsed.updatedAt).toEqual(task.updatedAt);
    expect(parsed.dueDate).toEqual(task.dueDate);
    expect(parsed.lastSyncedAt).toEqual(task.lastSyncedAt);
  });

  it("prefers deletedAt for conflict comparison", () => {
    const local = createTask({
      updatedAt: new Date("2025-02-01T00:00:00.000Z"),
    });
    const remote = createTask({
      updatedAt: new Date("2025-01-31T00:00:00.000Z"),
      deletedAt: new Date("2025-02-03T00:00:00.000Z"),
    });

    expect(isRemoteNewer(remote, local)).toBe(true);
  });
});
