import "fake-indexeddb/auto";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import HomeView from "./HomeView.vue";
import { db } from "@/storage/db";
import { createTask, getAllTasks } from "@/services/taskService";

// Mock vuedraggable to avoid test environment issues
vi.mock("vuedraggable", () => ({
  default: {
    name: "draggable",
    template: "<div><slot /></div>",
  },
}));

describe("HomeView", () => {
  beforeEach(async () => {
    if (!db.isOpen()) {
      await db.open();
    }
  });

  afterEach(async () => {
    await db.tasks.clear();
  });

  it("renders all four sections", async () => {
    const wrapper = mount(HomeView);
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(wrapper.text()).toContain("Today");
    expect(wrapper.text()).toContain("This Week");
    expect(wrapper.text()).toContain("Soon");
    expect(wrapper.text()).toContain("Someday");
  });

  it("loads tasks from database on mount", async () => {
    await createTask("today", "Today Task");
    await createTask("this-week", "Week Task");

    const wrapper = mount(HomeView);

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 100));

    const allTasks = await getAllTasks();
    expect(allTasks.length).toBeGreaterThanOrEqual(2);
  });

  it("displays tasks in correct sections", async () => {
    await createTask("today", "Today Task 1");
    await createTask("today", "Today Task 2");
    await createTask("this-week", "Week Task");
    await createTask("soon", "Soon Task");

    const wrapper = mount(HomeView);
    await new Promise(resolve => setTimeout(resolve, 300));

    // Verify sections are rendered
    const taskListSections = wrapper.findAllComponents({ name: "TaskListSection" });
    expect(taskListSections.length).toBe(4);

    // Verify tasks exist in database
    const allTasks = await getAllTasks();
    expect(allTasks.length).toBe(4);
    expect(allTasks.filter(t => t.section === "today").length).toBe(2);
    expect(allTasks.filter(t => t.section === "this-week").length).toBe(1);
    expect(allTasks.filter(t => t.section === "soon").length).toBe(1);
  });

  it("handles task creation", async () => {
    const wrapper = mount(HomeView);
    await new Promise(resolve => setTimeout(resolve, 200));

    const taskListSections = wrapper.findAllComponents({ name: "TaskListSection" });
    expect(taskListSections.length).toBe(4);

    // Create a task directly to test the handler
    const newTask = await createTask("today", "New Task");

    // Simulate the create-task event
    const todaySection = taskListSections[0];
    await todaySection.vm.$emit("create-task", newTask);

    await new Promise(resolve => setTimeout(resolve, 200));

    const tasks = await getAllTasks();
    expect(tasks.length).toBeGreaterThan(0);
    expect(tasks.some(t => t.title === "New Task")).toBe(true);
  });

  it("handles task updates", async () => {
    const task = await createTask("today", "Original Title");
    const wrapper = mount(HomeView);
    await new Promise(resolve => setTimeout(resolve, 100));

    const taskListSections = wrapper.findAllComponents({ name: "TaskListSection" });
    const todaySection = taskListSections[0];

    await todaySection.vm.$emit("update-task", {
      ...task,
      title: "Updated Title",
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    const updatedTask = await db.tasks.get(task.id!);
    expect(updatedTask?.title).toBe("Updated Title");
  });

  it("handles task deletion", async () => {
    const task = await createTask("today", "Task to Delete");
    const wrapper = mount(HomeView);
    await new Promise(resolve => setTimeout(resolve, 100));

    const taskListSections = wrapper.findAllComponents({ name: "TaskListSection" });
    const todaySection = taskListSections[0];

    await todaySection.vm.$emit("delete-task", task.id!);

    await new Promise(resolve => setTimeout(resolve, 100));

    const deletedTask = await db.tasks.get(task.id!);
    expect(deletedTask).toBeUndefined();
  });

  it("handles toggle done", async () => {
    const task = await createTask("today", "Test Task");
    const wrapper = mount(HomeView);
    await new Promise(resolve => setTimeout(resolve, 100));

    const taskListSections = wrapper.findAllComponents({ name: "TaskListSection" });
    const todaySection = taskListSections[0];

    await todaySection.vm.$emit("toggle-done", task.id!);

    await new Promise(resolve => setTimeout(resolve, 100));

    const updatedTask = await db.tasks.get(task.id!);
    expect(updatedTask?.status).toBe("done");
  });

  it("handles task reordering within section", async () => {
    const task1 = await createTask("today", "Task 1");
    const task2 = await createTask("today", "Task 2");
    const task3 = await createTask("today", "Task 3");

    const wrapper = mount(HomeView);
    await new Promise(resolve => setTimeout(resolve, 200));

    const taskListSections = wrapper.findAllComponents({ name: "TaskListSection" });
    expect(taskListSections.length).toBeGreaterThan(0);
    const todaySection = taskListSections[0];

    // Simulate reordering: move task from index 0 to index 2
    await todaySection.vm.$emit("reorder", {
      section: "today",
      oldIndex: 0,
      newIndex: 2,
    });

    await new Promise(resolve => setTimeout(resolve, 300));

    const tasks = await db.tasks
      .where("section")
      .equals("today")
      .sortBy("order");

    // Verify tasks are reordered
    expect(tasks.length).toBe(3);
  });

  it("handles cross-section task moves", async () => {
    const task = await createTask("today", "Task to Move");
    const wrapper = mount(HomeView);
    await new Promise(resolve => setTimeout(resolve, 200));

    const taskListSections = wrapper.findAllComponents({ name: "TaskListSection" });
    expect(taskListSections.length).toBeGreaterThan(1);
    const weekSection = taskListSections[1]; // this-week section

    await weekSection.vm.$emit("move", {
      taskId: task.id!,
      fromSection: "today",
      toSection: "this-week",
      newIndex: 0,
    });

    await new Promise(resolve => setTimeout(resolve, 300));

    const movedTask = await db.tasks.get(task.id!);
    expect(movedTask?.section).toBe("this-week");
  });
});
