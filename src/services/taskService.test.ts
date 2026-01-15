import "fake-indexeddb/auto";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  createTask,
  updateTask,
  deleteTask,
  getTasksBySection,
  getTask,
  getAllTasks,
  reorderTask,
  moveTaskToSection,
  reorderTasks,
  toggleTaskDone, // Added in task-18
} from "./taskService";
import { db } from "@/storage/db";

describe("TaskService", () => {
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

  describe("createTask", () => {
    it("creates a task with valid data", async () => {
      const task = await createTask("today", "Test Task");

      expect(task).toBeDefined();
      expect(task.id).toBeGreaterThan(0);
      expect(task.syncId).toBeDefined();
      expect(task.deviceId).toBeDefined();
      expect(task.title).toBe("Test Task");
      expect(task.section).toBe("today");
      expect(task.order).toBe(0);
      expect(task.status).toBe("todo");
      expect(task.createdAt).toBeInstanceOf(Date);
      expect(task.updatedAt).toBeInstanceOf(Date);
    });

    it("assigns sequential order values for tasks in the same section", async () => {
      const task1 = await createTask("today", "Task 1");
      const task2 = await createTask("today", "Task 2");
      const task3 = await createTask("today", "Task 3");

      expect(task1.order).toBe(0);
      expect(task2.order).toBe(1);
      expect(task3.order).toBe(2);
    });

    it("assigns order starting from 0 for each section independently", async () => {
      const todayTask = await createTask("today", "Today Task");
      const weekTask = await createTask("this-week", "Week Task");
      const soonTask = await createTask("soon", "Soon Task");

      expect(todayTask.order).toBe(0);
      expect(weekTask.order).toBe(0);
      expect(soonTask.order).toBe(0);
    });

    it("trims whitespace from title", async () => {
      const task = await createTask("today", "  Test Task  ");

      expect(task.title).toBe("Test Task");
    });

    it("throws error for empty title", async () => {
      await expect(createTask("today", "")).rejects.toThrow(
        "Task title is required"
      );
    });

    it("throws error for invalid section", async () => {
      await expect(
        createTask("invalid-section" as any, "Test Task")
      ).rejects.toThrow("Invalid section");
    });
  });

  describe("updateTask", () => {
    it("updates an existing task", async () => {
      const created = await createTask("today", "Original Title");
      const updated = await updateTask(created.id!, {
        title: "Updated Title",
        status: "in-progress",
      });

      expect(updated.title).toBe("Updated Title");
      expect(updated.status).toBe("in-progress");
      expect(updated.updatedAt.getTime()).toBeGreaterThan(
        created.updatedAt.getTime()
      );
    });

    it("updates task section", async () => {
      const created = await createTask("today", "Task");
      const updated = await updateTask(created.id!, {
        section: "this-week",
      });

      expect(updated.section).toBe("this-week");
    });

    it("updates task order", async () => {
      const created = await createTask("today", "Task");
      const updated = await updateTask(created.id!, {
        order: 5,
      });

      expect(updated.order).toBe(5);
    });

    it("throws error when updating non-existent task", async () => {
      await expect(updateTask(99999, { title: "New Title" })).rejects.toThrow(
        "Task with id 99999 not found"
      );
    });

    it("preserves existing fields when updating", async () => {
      const created = await createTask("today", "Task");
      const updated = await updateTask(created.id!, {
        title: "Updated Title",
      });

      expect(updated.section).toBe(created.section);
      expect(updated.order).toBe(created.order);
      expect(updated.status).toBe(created.status);
    });
  });

  describe("deleteTask", () => {
    it("deletes an existing task", async () => {
      const created = await createTask("today", "Task to Delete");
      const id = created.id!;

      await deleteTask(id);

      const task = await getTask(id);
      expect(task).toBeUndefined();
    });

    it("throws error when deleting non-existent task", async () => {
      await expect(deleteTask(99999)).rejects.toThrow(
        "Task with id 99999 not found"
      );
    });
  });

  describe("getTasksBySection", () => {
    it("returns tasks for a specific section", async () => {
      await createTask("today", "Today Task 1");
      await createTask("today", "Today Task 2");
      await createTask("this-week", "Week Task");

      const todayTasks = await getTasksBySection("today");

      expect(todayTasks.length).toBe(2);
      expect(todayTasks.every(t => t.section === "today")).toBe(true);
    });

    it("returns tasks sorted by order", async () => {
      const task1 = await createTask("today", "Task 1");
      const task2 = await createTask("today", "Task 2");
      const task3 = await createTask("today", "Task 3");

      // Update orders to be non-sequential
      await updateTask(task2.id!, { order: 0 });
      await updateTask(task1.id!, { order: 2 });
      await updateTask(task3.id!, { order: 1 });

      const tasks = await getTasksBySection("today");

      expect(tasks.length).toBe(3);
      expect(tasks[0].order).toBe(0);
      expect(tasks[1].order).toBe(1);
      expect(tasks[2].order).toBe(2);
    });

    it("returns empty array for section with no tasks", async () => {
      const tasks = await getTasksBySection("someday");

      expect(tasks).toEqual([]);
    });

    it("throws error for invalid section", async () => {
      await expect(
        getTasksBySection("invalid-section" as any)
      ).rejects.toThrow("Invalid section");
    });
  });

  describe("getTask", () => {
    it("returns a task by ID", async () => {
      const created = await createTask("today", "Test Task");
      const task = await getTask(created.id!);

      expect(task).toBeDefined();
      expect(task?.id).toBe(created.id);
      expect(task?.title).toBe("Test Task");
    });

    it("returns undefined for non-existent task", async () => {
      const task = await getTask(99999);

      expect(task).toBeUndefined();
    });
  });

  describe("getAllTasks", () => {
    it("returns all tasks", async () => {
      await createTask("today", "Today Task");
      await createTask("this-week", "Week Task");
      await createTask("soon", "Soon Task");

      const allTasks = await getAllTasks();

      expect(allTasks.length).toBe(3);
    });

    it("returns empty array when no tasks exist", async () => {
      const tasks = await getAllTasks();

      expect(tasks).toEqual([]);
    });

    it("excludes deleted tasks from results", async () => {
      const created = await createTask("today", "Task to Delete");
      await deleteTask(created.id!);

      const tasks = await getAllTasks();
      expect(tasks).toEqual([]);
    });
  });

  describe("reorderTask", () => {
    it("updates task order", async () => {
      const task = await createTask("today", "Task");
      const updated = await reorderTask(task.id!, 5);

      expect(updated.order).toBe(5);
    });

    it("throws error for non-existent task", async () => {
      await expect(reorderTask(99999, 0)).rejects.toThrow(
        "Task with id 99999 not found"
      );
    });
  });

  describe("moveTaskToSection", () => {
    it("moves task to different section", async () => {
      const task = await createTask("today", "Task");
      const updated = await moveTaskToSection(task.id!, "this-week");

      expect(updated.section).toBe("this-week");
      expect(updated.order).toBe(0); // Should be first in new section
    });

    it("assigns correct order in target section", async () => {
      await createTask("this-week", "Week Task 1");
      await createTask("this-week", "Week Task 2");
      const todayTask = await createTask("today", "Today Task");

      const moved = await moveTaskToSection(todayTask.id!, "this-week");

      expect(moved.section).toBe("this-week");
      expect(moved.order).toBe(2); // Should be after existing tasks
    });

    it("throws error for non-existent task", async () => {
      await expect(moveTaskToSection(99999, "today")).rejects.toThrow(
        "Task with id 99999 not found"
      );
    });
  });

  describe("reorderTasks", () => {
    it("reorders multiple tasks", async () => {
      const task1 = await createTask("today", "Task 1");
      const task2 = await createTask("today", "Task 2");
      const task3 = await createTask("today", "Task 3");

      await reorderTasks([
        { id: task1.id!, order: 2 },
        { id: task2.id!, order: 0 },
        { id: task3.id!, order: 1 },
      ]);

      const tasks = await getTasksBySection("today");
      const task1Updated = tasks.find(t => t.id === task1.id);
      const task2Updated = tasks.find(t => t.id === task2.id);
      const task3Updated = tasks.find(t => t.id === task3.id);

      expect(task1Updated?.order).toBe(2);
      expect(task2Updated?.order).toBe(0);
      expect(task3Updated?.order).toBe(1);
    });

    it("handles empty array", async () => {
      await expect(reorderTasks([])).resolves.not.toThrow();
    });
  });

  describe("toggleTaskDone", () => {
    it("marks task as done and stores originalSection", async () => {
      const task = await createTask("today", "Test Task");
      const updated = await toggleTaskDone(task.id!);

      expect(updated.status).toBe("done");
      expect(updated.originalSection).toBe("today");
    });

    it("reopens task and restores originalSection", async () => {
      const task = await createTask("this-week", "Test Task");
      const doneTask = await toggleTaskDone(task.id!);
      expect(doneTask.status).toBe("done");
      expect(doneTask.originalSection).toBe("this-week");

      const reopened = await toggleTaskDone(task.id!);

      expect(reopened.status).toBe("todo");
      expect(reopened.section).toBe("this-week");
      expect(reopened.originalSection).toBeUndefined();
    });

    it("defaults to 'today' when reopening task without originalSection", async () => {
      const task = await createTask("soon", "Test Task");

      // Manually set status to done without originalSection (simulating old data)
      await updateTask(task.id!, {
        status: "done",
        originalSection: undefined,
      });

      const reopened = await toggleTaskDone(task.id!);

      expect(reopened.status).toBe("todo");
      expect(reopened.section).toBe("today");
    });

    it("assigns correct order when reopening to a section", async () => {
      await createTask("this-week", "Existing Task 1");
      await createTask("this-week", "Existing Task 2");
      const task = await createTask("this-week", "Test Task");

      const doneTask = await toggleTaskDone(task.id!);
      const reopened = await toggleTaskDone(task.id!);

      expect(reopened.section).toBe("this-week");
      // Should be after existing tasks in this-week (order 0, 1, so new order is 2)
      expect(reopened.order).toBe(2);
    });

    it("throws error for non-existent task", async () => {
      await expect(toggleTaskDone(99999)).rejects.toThrow(
        "Task with id 99999 not found"
      );
    });
  });
});
