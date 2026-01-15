import Dexie, { Table } from "dexie";
import { z } from "zod";
import { createSyncId } from "@/utils/ids";
import { getDeviceId } from "@/sync/syncIdentity";

// Task schema for runtime validation and type inference
export const taskSchema = z.object({
  id: z.number().optional(),
  syncId: z.string(),
  deviceId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "done"]),
  section: z.enum(["today", "this-week", "soon", "someday"]),
  order: z.number(),
  originalSection: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  dueDate: z.date().optional(),
  deletedAt: z.date().optional(),
  lastSyncedAt: z.date().optional(),
});

// Infer TypeScript type from Zod schema
export type Task = z.infer<typeof taskSchema>;

export type SyncOperationType = "upsert" | "delete";

export type SyncQueueEntry = {
  id?: number;
  type: SyncOperationType;
  taskSyncId: string;
  payload: Task;
  createdAt: Date;
};

// Database class extending Dexie
class TasksDatabase extends Dexie {
  tasks!: Table<Task, number>;
  syncQueue!: Table<SyncQueueEntry, number>;

  constructor() {
    super("TasksDatabase");

    // Version 1: Original schema without section/order fields
    this.version(1).stores({
      tasks: "++id, title, status, createdAt, updatedAt, dueDate",
    });

    // Version 2: Add section, order, and originalSection fields
    this.version(2)
      .stores({
        tasks: "++id, title, status, section, order, createdAt, updatedAt, dueDate",
      })
      .upgrade(async (tx) => {
        // Migration: Update all existing tasks with default values
        const tasks = await tx.table("tasks").toCollection().toArray();

        for (let i = 0; i < tasks.length; i++) {
          const task = tasks[i];
          await tx.table("tasks").update(task.id, {
            section: "today", // Default section for existing tasks
            order: i, // Sequential order based on array index
            // originalSection left undefined for existing tasks
          });
        }
      });

    // Version 3: Add sync metadata and sync queue
    this.version(3)
      .stores({
        tasks:
          "++id, &syncId, deviceId, title, status, section, order, createdAt, updatedAt, dueDate, deletedAt, lastSyncedAt",
        syncQueue: "++id, type, createdAt, taskSyncId",
      })
      .upgrade(async (tx) => {
        const tasks = await tx.table("tasks").toCollection().toArray();
        const deviceId = getDeviceId();

        for (const task of tasks) {
          await tx.table("tasks").update(task.id, {
            syncId: task.syncId ?? createSyncId(),
            deviceId: task.deviceId ?? deviceId,
          });
        }
      });
  }
}

// Create and export database instance
export const db = new TasksDatabase();
