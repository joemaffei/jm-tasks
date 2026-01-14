import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import TaskInput from "./TaskInput.vue";

describe("TaskInput", () => {
  it("renders with initial value", () => {
    const wrapper = mount(TaskInput, {
      props: {
        modelValue: "Test Task",
      },
    });

    const input = wrapper.find("input");
    expect(input.element.value).toBe("Test Task");
  });

  it("updates value when modelValue prop changes", async () => {
    const wrapper = mount(TaskInput, {
      props: {
        modelValue: "Initial Value",
      },
    });

    await wrapper.setProps({ modelValue: "Updated Value" });

    const input = wrapper.find("input");
    expect(input.element.value).toBe("Updated Value");
  });

  it("emits update:modelValue on blur", async () => {
    const wrapper = mount(TaskInput, {
      props: {
        modelValue: "Original",
      },
    });

    const input = wrapper.find("input");
    await input.setValue("New Value");
    await input.trigger("blur");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["New Value"]);
    expect(wrapper.emitted("save")).toBeTruthy();
    expect(wrapper.emitted("save")?.[0]).toEqual(["New Value"]);
  });

  it("emits save on Enter key", async () => {
    const wrapper = mount(TaskInput, {
      props: {
        modelValue: "Original",
      },
    });

    const input = wrapper.find("input");
    await input.setValue("New Value");
    await input.trigger("keydown", { key: "Enter" });

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["New Value"]);
    expect(wrapper.emitted("save")).toBeTruthy();
    expect(wrapper.emitted("save")?.[0]).toEqual(["New Value"]);
  });

  it("emits cancel and reverts value on Escape key", async () => {
    const wrapper = mount(TaskInput, {
      props: {
        modelValue: "Original",
      },
    });

    const input = wrapper.find("input");
    await input.setValue("Changed Value");
    await input.trigger("keydown", { key: "Escape" });

    expect(wrapper.emitted("cancel")).toBeTruthy();
    // Value should revert to original
    expect(input.element.value).toBe("Original");
  });

  it("displays placeholder", () => {
    const wrapper = mount(TaskInput, {
      props: {
        modelValue: "",
        placeholder: "Enter task title",
      },
    });

    const input = wrapper.find("input");
    expect(input.attributes("placeholder")).toBe("Enter task title");
  });

  it("auto-focuses when autoFocus prop is true", async () => {
    const focusSpy = vi.spyOn(HTMLInputElement.prototype, "focus");
    const selectSpy = vi.spyOn(HTMLInputElement.prototype, "select");

    mount(TaskInput, {
      props: {
        modelValue: "Test",
        autoFocus: true,
      },
    });

    // Wait for nextTick to ensure focus is called
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(focusSpy).toHaveBeenCalled();
    expect(selectSpy).toHaveBeenCalled();
  });

  it("does not auto-focus when autoFocus prop is false", async () => {
    const focusSpy = vi.spyOn(HTMLInputElement.prototype, "focus");

    mount(TaskInput, {
      props: {
        modelValue: "Test",
        autoFocus: false,
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(focusSpy).not.toHaveBeenCalled();
  });

  it("selects all text on focus", async () => {
    const selectSpy = vi.spyOn(HTMLInputElement.prototype, "select");

    const wrapper = mount(TaskInput, {
      props: {
        modelValue: "Test Task",
      },
    });

    const input = wrapper.find("input");
    await input.trigger("focus");

    expect(selectSpy).toHaveBeenCalled();
  });
});
