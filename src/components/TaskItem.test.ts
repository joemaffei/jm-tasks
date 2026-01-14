import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import TaskItem from "./TaskItem.vue";
import type { Task } from "@/storage/db";

const createTestTask = (overrides?: Partial<Task>): Task => ({
  id: 1,
  title: "Test Task",
  status: "todo",
  section: "today",
  order: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe("TaskItem", () => {
  it("renders task title", () => {
    const task = createTestTask();
    const wrapper = mount(TaskItem, {
      props: {
        task,
      },
    });

    const taskInput = wrapper.findComponent({ name: "TaskInput" });
    expect(taskInput.props("modelValue")).toBe("Test Task");
  });

  it("displays checkbox unchecked for todo task", () => {
    const task = createTestTask({ status: "todo" });
    const wrapper = mount(TaskItem, {
      props: {
        task,
      },
    });

    const checkbox = wrapper.find('input[type="checkbox"]');
    expect(checkbox.element.checked).toBe(false);
  });

  it("displays checkbox checked for done task", () => {
    const task = createTestTask({ status: "done" });
    const wrapper = mount(TaskItem, {
      props: {
        task,
      },
    });

    const checkbox = wrapper.find('input[type="checkbox"]');
    expect(checkbox.element.checked).toBe(true);
  });

  it("applies done styling to done tasks", () => {
    const task = createTestTask({ status: "done" });
    const wrapper = mount(TaskItem, {
      props: {
        task,
      },
    });

    const container = wrapper.find("div.flex-1");
    expect(container.classes()).toContain("line-through");
    expect(container.classes()).toContain("text-gray-400");
  });

  it("applies opacity to done tasks", () => {
    const task = createTestTask({ status: "done" });
    const wrapper = mount(TaskItem, {
      props: {
        task,
      },
    });

    const root = wrapper.find("div.flex");
    expect(root.classes()).toContain("opacity-60");
  });

  it("emits toggle-done when checkbox is clicked", async () => {
    const task = createTestTask({ status: "todo" });
    const wrapper = mount(TaskItem, {
      props: {
        task,
      },
    });

    const checkbox = wrapper.find('input[type="checkbox"]');
    await checkbox.trigger("change");

    expect(wrapper.emitted("toggle-done")).toBeTruthy();
    expect(wrapper.emitted("toggle-done")?.[0]).toEqual([task.id]);
  });

  it("emits update:task when title is updated", async () => {
    const task = createTestTask();
    const wrapper = mount(TaskItem, {
      props: {
        task,
      },
    });

    const taskInput = wrapper.findComponent({ name: "TaskInput" });
    await taskInput.vm.$emit("update:modelValue", "New Title");

    expect(wrapper.emitted("update:task")).toBeTruthy();
    const emittedTask = wrapper.emitted("update:task")?.[0]?.[0] as Task;
    expect(emittedTask.title).toBe("New Title");
    expect(emittedTask.id).toBe(task.id);
  });

  it("emits delete when delete button is clicked", async () => {
    const task = createTestTask();
    const wrapper = mount(TaskItem, {
      props: {
        task,
      },
    });

    const deleteButton = wrapper.find("button");
    await deleteButton.trigger("click");

    expect(wrapper.emitted("delete")).toBeTruthy();
    expect(wrapper.emitted("delete")?.[0]).toEqual([task.id]);
  });

  it("does not apply done styling to todo tasks", () => {
    const task = createTestTask({ status: "todo" });
    const wrapper = mount(TaskItem, {
      props: {
        task,
      },
    });

    const container = wrapper.find("div.flex-1");
    expect(container.classes()).not.toContain("line-through");
    expect(container.classes()).not.toContain("text-gray-400");
  });

  it("does not apply opacity to todo tasks", () => {
    const task = createTestTask({ status: "todo" });
    const wrapper = mount(TaskItem, {
      props: {
        task,
      },
    });

    const root = wrapper.find("div.flex");
    expect(root.classes()).not.toContain("opacity-60");
  });
});

