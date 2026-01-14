import Dexie, { Table } from "dexie";
import { z } from "zod";

// Task schema for runtime validation and type inference
export const taskSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "done"]),
  section: z.enum(["today", "this-week", "soon", "someday"]),
  order: z.number(),
  originalSection: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  dueDate: z.date().optional(),
});

// Infer TypeScript type from Zod schema
export type Task = z.infer<typeof taskSchema>;

// Database class extending Dexie
class TasksDatabase extends Dexie {
  tasks!: Table<Task, number>;

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
  }
}

// Create and export database instance
export const db = new TasksDatabase();
