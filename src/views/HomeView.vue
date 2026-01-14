<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import TaskListSection from "@/components/TaskListSection.vue";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskDone,
} from "@/services/taskService";
import type { Task } from "@/storage/db";

const tasks = ref<Task[]>([]);

// Computed properties for each section
const todayTasks = computed(() =>
  tasks.value.filter(t => t.section === "today")
);
const thisWeekTasks = computed(() =>
  tasks.value.filter(t => t.section === "this-week")
);
const soonTasks = computed(() =>
  tasks.value.filter(t => t.section === "soon")
);
const somedayTasks = computed(() =>
  tasks.value.filter(t => t.section === "someday")
);

// Load tasks on mount
onMounted(async () => {
  await loadTasks();
});

const loadTasks = async () => {
  try {
    tasks.value = await getAllTasks();
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
};

// Event handlers
const handleCreateTask = async (task: Task) => {
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
    <h1 class="text-3xl font-semibold text-slate-800 mb-8">Task Management</h1>
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
