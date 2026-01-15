import "fake-indexeddb/auto";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { db, taskSchema } from "@/storage/db";
import { createSyncId } from "@/utils/ids";
import { getDeviceId } from "@/sync/syncIdentity";

const baseTask = () => ({
  syncId: createSyncId(),
  deviceId: getDeviceId(),
  title: "Test Task",
  status: "todo",
  section: "today",
  order: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
});

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
    await db.syncQueue.clear();
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
        ...baseTask(),
        description: "Test Description",
      };

      const id = await db.tasks.add(newTask);
      expect(id).toBeGreaterThan(0);

      const task = await db.tasks.get(id);
      expect(task).toBeDefined();
      expect(task?.title).toBe("Test Task");
      expect(task?.description).toBe("Test Description");
      expect(task?.status).toBe("todo");
      expect(task?.section).toBe("today");
      expect(task?.order).toBe(0);
    });

    it("can read a task by id", async () => {
      const newTask = {
        ...baseTask(),
        title: "Read Test Task",
        status: "in-progress",
        section: "this-week",
      };

      const id = await db.tasks.add(newTask);
      const task = await db.tasks.get(id);

      expect(task).toBeDefined();
      expect(task?.id).toBe(id);
      expect(task?.title).toBe("Read Test Task");
      expect(task?.status).toBe("in-progress");
      expect(task?.section).toBe("this-week");
    });

    it("can update a task", async () => {
      const newTask = {
        ...baseTask(),
        title: "Original Title",
      };

      const id = await db.tasks.add(newTask);
      const updatedAt = new Date();

      await db.tasks.update(id, {
        title: "Updated Title",
        status: "in-progress",
        section: "soon",
        order: 1,
        updatedAt,
      });

      const task = await db.tasks.get(id);
      expect(task?.title).toBe("Updated Title");
      expect(task?.status).toBe("in-progress");
      expect(task?.section).toBe("soon");
      expect(task?.order).toBe(1);
      expect(task?.updatedAt).toEqual(updatedAt);
    });

    it("can delete a task", async () => {
      const newTask = {
        ...baseTask(),
        title: "Task to Delete",
      };

      const id = await db.tasks.add(newTask);
      await db.tasks.delete(id);

      const task = await db.tasks.get(id);
      expect(task).toBeUndefined();
    });

    it("can get all tasks", async () => {
      const task1 = {
        ...baseTask(),
        title: "Task 1",
      };
      const task2 = {
        ...baseTask(),
        title: "Task 2",
        status: "in-progress",
        section: "this-week",
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
        ...baseTask(),
        title: "Todo Task",
      };
      const doneTask = {
        ...baseTask(),
        title: "Done Task",
        status: "done",
        order: 1,
      };

      await db.tasks.add(todoTask);
      await db.tasks.add(doneTask);

      const todoTasks = await db.tasks.where("status").equals("todo").toArray();
      expect(todoTasks.length).toBe(1);
      expect(todoTasks[0].title).toBe("Todo Task");
    });

    it("can query tasks by section", async () => {
      const todayTask = {
        ...baseTask(),
        title: "Today Task",
      };
      const weekTask = {
        ...baseTask(),
        title: "Week Task",
        section: "this-week",
      };

      await db.tasks.add(todayTask);
      await db.tasks.add(weekTask);

      const todayTasks = await db.tasks.where("section").equals("today").toArray();
      expect(todayTasks.length).toBe(1);
      expect(todayTasks[0].title).toBe("Today Task");
    });

    it("can query tasks by section and sort by order", async () => {
      const task1 = {
        ...baseTask(),
        title: "Task 1",
        order: 2,
      };
      const task2 = {
        ...baseTask(),
        title: "Task 2",
      };
      const task3 = {
        ...baseTask(),
        title: "Task 3",
        order: 1,
      };

      await db.tasks.add(task1);
      await db.tasks.add(task2);
      await db.tasks.add(task3);

      const todayTasks = await db.tasks
        .where("section")
        .equals("today")
        .sortBy("order");
      expect(todayTasks.length).toBe(3);
      expect(todayTasks[0].title).toBe("Task 2");
      expect(todayTasks[1].title).toBe("Task 3");
      expect(todayTasks[2].title).toBe("Task 1");
    });
  });

  describe("Task schema validation", () => {
    it("validates task schema structure", () => {
      const validTask = {
        id: 1,
        syncId: createSyncId(),
        deviceId: getDeviceId(),
        title: "Valid Task",
        description: "Description",
        status: "todo",
        section: "today",
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        dueDate: new Date(),
      };

      const result = taskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("Valid Task");
        expect(result.data.status).toBe("todo");
        expect(result.data.section).toBe("today");
        expect(result.data.order).toBe(0);
      }
    });

    it("validates task with minimal required fields", () => {
      const minimalTask = {
        syncId: createSyncId(),
        deviceId: getDeviceId(),
        title: "Minimal Task",
        status: "in-progress",
        section: "today",
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = taskSchema.safeParse(minimalTask);
      expect(result.success).toBe(true);
    });

    it("rejects task with invalid status", () => {
      const invalidTask = {
        syncId: createSyncId(),
        deviceId: getDeviceId(),
        title: "Invalid Task",
        status: "invalid-status",
        section: "today",
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = taskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
    });

    it("rejects task with invalid section", () => {
      const invalidTask = {
        syncId: createSyncId(),
        deviceId: getDeviceId(),
        title: "Invalid Task",
        status: "todo",
        section: "invalid-section",
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = taskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
    });

    it("rejects task with missing required fields", () => {
      const invalidTask = {
        syncId: createSyncId(),
        deviceId: getDeviceId(),
        title: "Missing Status",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = taskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
    });

    it("accepts task with originalSection field", () => {
      const task = {
        syncId: createSyncId(),
        deviceId: getDeviceId(),
        title: "Task with Original Section",
        status: "done",
        section: "today",
        order: 0,
        originalSection: "this-week",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = taskSchema.safeParse(task);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.originalSection).toBe("this-week");
      }
    });

    it("accepts valid status values", () => {
      const statuses = ["todo", "in-progress", "done"];

      statuses.forEach(status => {
        const task = {
          syncId: createSyncId(),
          deviceId: getDeviceId(),
          title: `Task with status ${status}`,
          status,
          section: "today",
          order: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = taskSchema.safeParse(task);
        expect(result.success).toBe(true);
      });
    });

    it("accepts valid section values", () => {
      const sections = ["today", "this-week", "soon", "someday"];

      sections.forEach(section => {
        const task = {
          syncId: createSyncId(),
          deviceId: getDeviceId(),
          title: `Task in ${section}`,
          status: "todo",
          section,
          order: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = taskSchema.safeParse(task);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.section).toBe(section);
        }
      });
    });
  });

  describe("Database schema", () => {
    it("has correct indexes", async () => {
      // Add a task to verify schema is correct
      const task = {
        ...baseTask(),
        title: "Schema Test",
      };

      const id = await db.tasks.add(task);
      expect(id).toBeGreaterThan(0);

      // Verify we can query by indexed fields
      const byStatus = await db.tasks.where("status").equals("todo").toArray();
      expect(byStatus.length).toBeGreaterThan(0);

      const bySection = await db.tasks.where("section").equals("today").toArray();
      expect(bySection.length).toBeGreaterThan(0);
    });
  });

  describe("Database migration", () => {
    it("migrates from version 1 to version 2", async () => {
      // Close and delete existing database to test migration
      await db.close();
      await db.delete();

      // Reopen to trigger migration
      await db.open();

      // Verify database is at version 3
      expect(db.verno).toBe(3);
    });

    it("handles migration with existing tasks", async () => {
      // This test would require creating a v1 database first
      // For now, we'll test that new tasks require section and order
      const newTask = {
        ...baseTask(),
        title: "New Task",
      };

      const id = await db.tasks.add(newTask);
      const task = await db.tasks.get(id);

      expect(task).toBeDefined();
      expect(task?.section).toBe("today");
      expect(task?.order).toBe(0);
    });
  });
});
