import "fake-indexeddb/auto";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import TaskListSection from "./TaskListSection.vue";
import type { Task } from "@/storage/db";
import { db } from "@/storage/db";

// Mock vuedraggable to avoid test environment issues
vi.mock("vuedraggable", () => ({
  default: {
    name: "draggable",
    template: "<div><slot /></div>",
  },
}));

const createTestTask = (overrides?: Partial<Task>): Task => ({
  id: Math.floor(Math.random() * 10000),
  title: "Test Task",
  status: "todo",
  section: "today",
  order: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe("TaskListSection", () => {
  beforeEach(async () => {
    if (!db.isOpen()) {
      await db.open();
    }
  });

  afterEach(async () => {
    await db.tasks.clear();
  });

  it("renders section title correctly", () => {
    const wrapper = mount(TaskListSection, {
      props: {
        section: "today",
        tasks: [],
      },
    });

    expect(wrapper.text()).toContain("Today");
  });

  it("renders correct title for each section", () => {
    const sections = [
      { section: "today", title: "Today" },
      { section: "this-week", title: "This Week" },
      { section: "soon", title: "Soon" },
      { section: "someday", title: "Someday" },
    ] as const;

    sections.forEach(({ section, title }) => {
      const wrapper = mount(TaskListSection, {
        props: {
          section,
          tasks: [],
        },
      });

      expect(wrapper.text()).toContain(title);
    });
  });

  it("displays tasks for the section", () => {
    const tasks = [
      createTestTask({ id: 1, section: "today", title: "Today Task 1" }),
      createTestTask({ id: 2, section: "today", title: "Today Task 2" }),
      createTestTask({ id: 3, section: "this-week", title: "Week Task" }),
    ];

    const wrapper = mount(TaskListSection, {
      props: {
        section: "today",
        tasks,
      },
    });

    const taskItems = wrapper.findAllComponents({ name: "TaskItem" });
    expect(taskItems.length).toBe(2);
  });

  it("filters tasks by section", () => {
    const tasks = [
      createTestTask({ id: 1, section: "today", title: "Today Task" }),
      createTestTask({ id: 2, section: "this-week", title: "Week Task" }),
    ];

    const wrapper = mount(TaskListSection, {
      props: {
        section: "today",
        tasks,
      },
    });

    const taskItems = wrapper.findAllComponents({ name: "TaskItem" });
    expect(taskItems.length).toBe(1);
    expect(taskItems[0].props("task").title).toBe("Today Task");
  });

  it("sorts tasks by order", () => {
    const tasks = [
      createTestTask({ id: 1, section: "today", order: 2, title: "Task 2" }),
      createTestTask({ id: 2, section: "today", order: 0, title: "Task 0" }),
      createTestTask({ id: 3, section: "today", order: 1, title: "Task 1" }),
    ];

    const wrapper = mount(TaskListSection, {
      props: {
        section: "today",
        tasks,
      },
    });

    const taskItems = wrapper.findAllComponents({ name: "TaskItem" });
    expect(taskItems.length).toBe(3);
    expect(taskItems[0].props("task").title).toBe("Task 0");
    expect(taskItems[1].props("task").title).toBe("Task 1");
    expect(taskItems[2].props("task").title).toBe("Task 2");
  });

  it("displays empty state when no tasks", () => {
    const wrapper = mount(TaskListSection, {
      props: {
        section: "today",
        tasks: [],
      },
    });

    expect(wrapper.text()).toContain("No tasks in this section");
  });

  it("emits create-task when New Task button is clicked", async () => {
    const wrapper = mount(TaskListSection, {
      props: {
        section: "today",
        tasks: [],
      },
    });

    const button = wrapper.find("button");
    await button.trigger("click");

    // Wait for async createTask to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(wrapper.emitted("create-task")).toBeTruthy();
  });

  it("emits update-task when task is updated", async () => {
    const task = createTestTask({ id: 1, section: "today" });
    const wrapper = mount(TaskListSection, {
      props: {
        section: "today",
        tasks: [task],
      },
    });

    const taskItem = wrapper.findComponent({ name: "TaskItem" });
    await taskItem.vm.$emit("update:task", { ...task, title: "Updated" });

    expect(wrapper.emitted("update-task")).toBeTruthy();
    const emittedTask = wrapper.emitted("update-task")?.[0]?.[0] as Task;
    expect(emittedTask.title).toBe("Updated");
  });

  it("emits toggle-done when task done status is toggled", async () => {
    const task = createTestTask({ id: 1, section: "today" });
    const wrapper = mount(TaskListSection, {
      props: {
        section: "today",
        tasks: [task],
      },
    });

    const taskItem = wrapper.findComponent({ name: "TaskItem" });
    await taskItem.vm.$emit("toggle-done", task.id);

    expect(wrapper.emitted("toggle-done")).toBeTruthy();
    expect(wrapper.emitted("toggle-done")?.[0]).toEqual([task.id]);
  });

  it("emits delete-task when task is deleted", async () => {
    const task = createTestTask({ id: 1, section: "today" });
    const wrapper = mount(TaskListSection, {
      props: {
        section: "today",
        tasks: [task],
      },
    });

    const taskItem = wrapper.findComponent({ name: "TaskItem" });
    await taskItem.vm.$emit("delete", task.id);

    expect(wrapper.emitted("delete-task")).toBeTruthy();
    expect(wrapper.emitted("delete-task")?.[0]).toEqual([task.id]);
  });
});
