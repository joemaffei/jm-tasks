<script setup lang="ts">
import { computed } from "vue";
import TaskInput from "./TaskInput.vue";
import type { Task } from "@/storage/db";

interface Props {
  task: Task;
}

interface Emits {
  (e: "update:task", task: Task): void;
  (e: "toggle-done", taskId: number): void;
  (e: "delete", taskId: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isDone = computed(() => props.task.status === "done");

const handleTitleUpdate = (newTitle: string) => {
  emit("update:task", {
    ...props.task,
    title: newTitle,
  });
};

const handleToggleDone = () => {
  emit("toggle-done", props.task.id!);
};

const handleDelete = () => {
  emit("delete", props.task.id!);
};
</script>

<template>
  <div
    class="flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition-colors"
    :class="{ 'opacity-60': isDone }"
  >
    <input
      type="checkbox"
      :checked="isDone"
      @change="handleToggleDone"
      class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
      :aria-label="`Mark task ${task.title} as ${isDone ? 'undone' : 'done'}`"
    />
    <div class="flex-1" :class="{ 'line-through text-gray-400': isDone }">
      <TaskInput
        :model-value="task.title"
        placeholder="Enter task title"
        @update:model-value="handleTitleUpdate"
      />
    </div>
    <button
      @click="handleDelete"
      class="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors"
      aria-label="Delete task"
    >
      Delete
    </button>
  </div>
</template>

