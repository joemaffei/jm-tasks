import { describe, it, expect } from "vitest";
import draggable from "vuedraggable";

describe("vuedraggable", () => {
  it("can be imported", () => {
    expect(draggable).toBeDefined();
    expect(typeof draggable).toBe("object");
  });

  it("has expected properties", () => {
    // vuedraggable should be a Vue component
    expect(draggable).toHaveProperty("name");
  });
});

