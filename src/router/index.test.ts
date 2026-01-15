import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "@/App.vue";
import HomeView from "@/views/HomeView.vue";

describe("Router", () => {
  it("renders HomeView at root path", async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: "/",
          name: "home",
          component: HomeView,
        },
      ],
    });

    const { getByRole } = render(App, {
      global: {
        plugins: [router],
      },
    });

    // Wait for router to navigate
    await router.push("/");
    await router.isReady();

    const heading = getByRole("heading", { name: /task management/i });
    expect(heading).toBeTruthy();
    expect(heading.textContent).toBe("Task Management");
  });

  it("router configuration is valid", () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: "/",
          name: "home",
          component: HomeView,
        },
      ],
    });

    expect(router).toBeTruthy();
    expect(router.getRoutes().length).toBeGreaterThan(0);
    const homeRoute = router.getRoutes().find(route => route.name === "home");
    expect(homeRoute).toBeTruthy();
    expect(homeRoute.path).toBe("/");
  });
});
