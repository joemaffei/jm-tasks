import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { initializeSync } from "@/sync/syncService";

initializeSync();

createApp(App).use(router).mount("#app");
