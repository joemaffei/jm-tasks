<script setup lang="ts">
import { computed, ref } from "vue";
import draggable from "vuedraggable";
import TaskItem from "./TaskItem.vue";
import { createTask } from "@/services/taskService";
import type { Task } from "@/storage/db";

interface Props {
  section: "today" | "this-week" | "soon" | "someday";
  tasks: Task[];
}

interface Emits {
  (e: "create-task", task: Task): void;
  (e: "update-task", task: Task): void;
  (e: "toggle-done", taskId: number): void;
  (e: "delete-task", taskId: number): void;
  (e: "reorder", data: { section: string; oldIndex: number; newIndex: number }): void;
  (e: "move", data: { taskId: number; fromSection: string; toSection: string; newIndex: number }): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const sectionTitle = computed(() => {
  const titles: Record<typeof props.section, string> = {
    today: "Today",
    "this-week": "This Week",
    soon: "Soon",
    someday: "Someday",
  };
  return titles[props.section];
});

const filteredTasks = computed({
  get: () => {
    return props.tasks
      .filter(task => task.section === props.section)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  },
  set: () => {
    // This is handled by drag events, not direct assignment
  },
});

const handleNewTask = async () => {
  try {
    const newTask = await createTask(props.section, "New Task");
    emit("create-task", newTask);
  } catch (error) {
    console.error("Error creating task:", error);
  }
};

const handleTaskUpdate = (task: Task) => {
  emit("update-task", task);
};

const handleToggleDone = (taskId: number) => {
  emit("toggle-done", taskId);
};

const handleDelete = (taskId: number) => {
  emit("delete-task", taskId);
};

const handleDragEnd = (event: any) => {
  const { oldIndex, newIndex, from, to } = event;

  // If moved within the same section
  if (from === to && oldIndex !== newIndex && oldIndex !== undefined && newIndex !== undefined) {
    // Emit reorder event - parent will handle the actual reordering
    emit("reorder", {
      section: props.section,
      oldIndex,
      newIndex,
    });
  }
};

const handleDragAdd = (event: any) => {
  const { newIndex, item } = event;
  
  // The item.element contains the task data
  if (item?.element && newIndex !== undefined) {
    const task = item.element as Task;
    emit("move", {
      taskId: task.id!,
      fromSection: task.section,
      toSection: props.section,
      newIndex,
    });
  }
};
</script>

<template>
  <div class="flex flex-col gap-4 p-4 border border-gray-200 rounded-lg">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-slate-800">{{ sectionTitle }}</h2>
      <button
        @click="handleNewTask"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        New Task
      </button>
    </div>
    <draggable
      :model-value="filteredTasks"
      :group="{ name: 'tasks', pull: true, put: true }"
      :item-key="(task: Task) => task.id!"
      :animation="200"
      ghost-class="opacity-50"
      chosen-class="border-blue-500"
      drag-class="cursor-grabbing"
      @end="handleDragEnd"
      @add="handleDragAdd"
      class="flex flex-col gap-2"
    >
      <template #item="{ element: task }">
        <TaskItem
          :key="task.id"
          :task="task"
          @update:task="handleTaskUpdate"
          @toggle-done="handleToggleDone"
          @delete="handleDelete"
        />
      </template>
    </draggable>
    <p v-if="filteredTasks.length === 0" class="text-gray-400 text-sm italic">
      No tasks in this section
    </p>
  </div>
</template>
