import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "@/App.vue";
import HomeView from "@/views/HomeView.vue";

describe("App.vue", () => {
  it("renders correctly", () => {
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

    const { container } = render(App, {
      global: {
        plugins: [router],
      },
    });
    expect(container).toBeTruthy();
  });

  it("renders router-view", async () => {
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

    await router.push("/");
    await router.isReady();

    const heading = getByRole("heading", { name: /task management/i });
    expect(heading).toBeTruthy();
  });
});
