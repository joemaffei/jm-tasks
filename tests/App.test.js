import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import App from "@/App.vue";

describe("App.vue", () => {
  it("renders correctly", () => {
    const { container } = render(App);
    expect(container).toBeTruthy();
  });

  it("displays Hello World heading", () => {
    const { getByRole } = render(App);
    const heading = getByRole("heading", { name: /hello world/i });
    expect(heading).toBeTruthy();
    expect(heading.textContent).toBe("Hello World");
  });
});
