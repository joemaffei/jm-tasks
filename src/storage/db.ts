import Dexie, { Table } from "dexie";
import { z } from "zod";

// Task schema for runtime validation and type inference
export const taskSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "done"]),
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

    // Extract indexed field names from schema (excluding description)
    const allFields = Object.keys(taskSchema.shape);
    const indexedFields = allFields
      .filter(key => key !== "description")
      .map(key => (key === "id" ? `++${key}` : key))
      .join(", ");

    // Define schema
    this.version(1).stores({
      tasks: indexedFields, // Field names derived from Zod schema
    });
  }
}

// Create and export database instance
export const db = new TasksDatabase();
