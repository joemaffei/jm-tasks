import "fake-indexeddb/auto";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { db, taskSchema } from "@/storage/db";

describe("Database", () => {
  beforeEach(async () => {
    // Ensure database is open before each test
    if (!db.isOpen()) {
      await db.open();
    }
  });

  afterEach(async () => {
    // Clear all data after each test to ensure isolation
    await db.tasks.clear();
  });

  describe("Database initialization", () => {
    it("can be imported", () => {
      expect(db).toBeDefined();
      expect(db).toBeInstanceOf(Object);
    });

    it("has tasks table defined", () => {
      expect(db.tasks).toBeDefined();
    });

    it("database name is correct", () => {
      expect(db.name).toBe("TasksDatabase");
    });

    it("database can be opened", async () => {
      await db.open();
      expect(db.isOpen()).toBe(true);
    });
  });

  describe("Task CRUD operations", () => {
    it("can create a task", async () => {
      const newTask = {
        title: "Test Task",
        description: "Test Description",
        status: "todo",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const id = await db.tasks.add(newTask);
      expect(id).toBeGreaterThan(0);

      const task = await db.tasks.get(id);
      expect(task).toBeDefined();
      expect(task?.title).toBe("Test Task");
      expect(task?.description).toBe("Test Description");
      expect(task?.status).toBe("todo");
    });

    it("can read a task by id", async () => {
      const newTask = {
        title: "Read Test Task",
        status: "in-progress",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const id = await db.tasks.add(newTask);
      const task = await db.tasks.get(id);

      expect(task).toBeDefined();
      expect(task?.id).toBe(id);
      expect(task?.title).toBe("Read Test Task");
      expect(task?.status).toBe("in-progress");
    });

    it("can update a task", async () => {
      const newTask = {
        title: "Original Title",
        status: "todo",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const id = await db.tasks.add(newTask);
      const updatedAt = new Date();

      await db.tasks.update(id, {
        title: "Updated Title",
        status: "in-progress",
        updatedAt,
      });

      const task = await db.tasks.get(id);
      expect(task?.title).toBe("Updated Title");
      expect(task?.status).toBe("in-progress");
      expect(task?.updatedAt).toEqual(updatedAt);
    });

    it("can delete a task", async () => {
      const newTask = {
        title: "Task to Delete",
        status: "todo",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const id = await db.tasks.add(newTask);
      await db.tasks.delete(id);

      const task = await db.tasks.get(id);
      expect(task).toBeUndefined();
    });

    it("can get all tasks", async () => {
      const task1 = {
        title: "Task 1",
        status: "todo",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const task2 = {
        title: "Task 2",
        status: "in-progress",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.tasks.add(task1);
      await db.tasks.add(task2);

      const allTasks = await db.tasks.toArray();
      expect(allTasks.length).toBe(2);
      expect(allTasks.map(t => t.title)).toContain("Task 1");
      expect(allTasks.map(t => t.title)).toContain("Task 2");
    });

    it("can query tasks by status", async () => {
      const todoTask = {
        title: "Todo Task",
        status: "todo",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const doneTask = {
        title: "Done Task",
        status: "done",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.tasks.add(todoTask);
      await db.tasks.add(doneTask);

      const todoTasks = await db.tasks.where("status").equals("todo").toArray();
      expect(todoTasks.length).toBe(1);
      expect(todoTasks[0].title).toBe("Todo Task");
    });
  });

  describe("Task schema validation", () => {
    it("validates task schema structure", () => {
      const validTask = {
        id: 1,
        title: "Valid Task",
        description: "Description",
        status: "todo",
        createdAt: new Date(),
        updatedAt: new Date(),
        dueDate: new Date(),
      };

      const result = taskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("Valid Task");
        expect(result.data.status).toBe("todo");
      }
    });

    it("validates task with minimal required fields", () => {
      const minimalTask = {
        title: "Minimal Task",
        status: "in-progress",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = taskSchema.safeParse(minimalTask);
      expect(result.success).toBe(true);
    });

    it("rejects task with invalid status", () => {
      const invalidTask = {
        title: "Invalid Task",
        status: "invalid-status",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = taskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
    });

    it("rejects task with missing required fields", () => {
      const invalidTask = {
        title: "Missing Status",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = taskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
    });

    it("accepts valid status values", () => {
      const statuses = ["todo", "in-progress", "done"];

      statuses.forEach(status => {
        const task = {
          title: `Task with status ${status}`,
          status,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = taskSchema.safeParse(task);
        expect(result.success).toBe(true);
      });
    });
  });

  describe("Database schema", () => {
    it("has correct indexes", async () => {
      // Add a task to verify schema is correct
      const task = {
        title: "Schema Test",
        status: "todo",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const id = await db.tasks.add(task);
      expect(id).toBeGreaterThan(0);

      // Verify we can query by indexed fields
      const byStatus = await db.tasks.where("status").equals("todo").toArray();
      expect(byStatus.length).toBeGreaterThan(0);
    });
  });
});
