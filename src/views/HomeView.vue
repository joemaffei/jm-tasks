<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import TaskListSection from "@/components/TaskListSection.vue";
import { getAllTasks, updateTask, deleteTask, toggleTaskDone } from "@/services/taskService";
import type { Task } from "@/storage/db";
import { getSyncStatusSnapshot, requestSync, subscribeToSyncStatus } from "@/sync/syncService";

const tasks = ref<Task[]>([]);
const syncStatus = ref(getSyncStatusSnapshot());
let lastSyncState: typeof syncStatus.value.state | null = null;
let unsubscribeSync: (() => void) | null = null;

// Load tasks on mount
const syncStateLabel = computed(() => {
  if (!syncStatus.value.enabled) {
    return "Sync disabled";
  }

  switch (syncStatus.value.state) {
    case "syncing":
      return "Syncing...";
    case "offline":
      return "Offline";
    case "error":
      return "Sync error";
    default:
      return "Synced";
  }
});

const lastSyncLabel = computed(() => {
  if (!syncStatus.value.lastSyncAt) {
    return "Never synced";
  }

  return `Last sync: ${syncStatus.value.lastSyncAt.toLocaleTimeString()}`;
});

const canSyncNow = computed(() => {
  if (!syncStatus.value.enabled) {
    return false;
  }

  return syncStatus.value.state !== "syncing";
});

const handleManualSync = async () => {
  if (!canSyncNow.value) {
    return;
  }

  await requestSync();
};

onMounted(async () => {
  unsubscribeSync = subscribeToSyncStatus(async nextStatus => {
    const previousState = lastSyncState ?? nextStatus.state;
    syncStatus.value = nextStatus;
    lastSyncState = nextStatus.state;

    if (previousState === "syncing" && nextStatus.state === "idle") {
      await loadTasks();
    }
  });
  await loadTasks();
});

onBeforeUnmount(() => {
  unsubscribeSync?.();
});

const loadTasks = async () => {
  try {
    tasks.value = await getAllTasks();
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
};

// Event handlers
const handleCreateTask = async () => {
  tasks.value = await getAllTasks();
};

const handleUpdateTask = async (task: Task) => {
  try {
    await updateTask(task.id!, {
      title: task.title,
    });
    tasks.value = await getAllTasks();
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

const handleToggleDone = async (taskId: number) => {
  try {
    await toggleTaskDone(taskId);
    tasks.value = await getAllTasks();
  } catch (error) {
    console.error("Error toggling task done:", error);
  }
};

const handleDeleteTask = async (taskId: number) => {
  try {
    await deleteTask(taskId);
    tasks.value = tasks.value.filter(t => t.id !== taskId);
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};
</script>

<template>
  <div class="p-8 max-w-6xl mx-auto">
    <div class="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-3xl font-semibold text-slate-800">Task Management</h1>
      <div class="flex items-center gap-3 text-sm text-slate-600">
        <span>{{ syncStateLabel }}</span>
        <span>{{ lastSyncLabel }}</span>
        <button
          class="rounded-md border border-slate-200 px-3 py-1 text-slate-700 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          :disabled="!canSyncNow"
          @click="handleManualSync"
        >
          Sync now
        </button>
      </div>
    </div>
    <div class="flex flex-col gap-8">
      <TaskListSection
        section="today"
        :tasks="tasks"
        @create-task="handleCreateTask"
        @update-task="handleUpdateTask"
        @toggle-done="handleToggleDone"
        @delete-task="handleDeleteTask"
      />
      <TaskListSection
        section="this-week"
        :tasks="tasks"
        @create-task="handleCreateTask"
        @update-task="handleUpdateTask"
        @toggle-done="handleToggleDone"
        @delete-task="handleDeleteTask"
      />
      <TaskListSection
        section="soon"
        :tasks="tasks"
        @create-task="handleCreateTask"
        @update-task="handleUpdateTask"
        @toggle-done="handleToggleDone"
        @delete-task="handleDeleteTask"
      />
      <TaskListSection
        section="someday"
        :tasks="tasks"
        @create-task="handleCreateTask"
        @update-task="handleUpdateTask"
        @toggle-done="handleToggleDone"
        @delete-task="handleDeleteTask"
      />
    </div>
  </div>
</template>
