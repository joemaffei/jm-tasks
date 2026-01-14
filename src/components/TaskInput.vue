<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue";

interface Props {
  modelValue: string;
  autoFocus?: boolean;
  placeholder?: string;
}

interface Emits {
  (e: "update:modelValue", value: string): void;
  (e: "save", value: string): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), {
  autoFocus: false,
  placeholder: "",
});

const emit = defineEmits<Emits>();

const inputRef = ref<HTMLInputElement | null>(null);
const inputValue = ref(props.modelValue);

// Sync with parent modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    inputValue.value = newValue;
  }
);

// Auto-focus on mount if requested
onMounted(async () => {
  if (props.autoFocus && inputRef.value) {
    await nextTick();
    inputRef.value.focus();
    inputRef.value.select();
  }
});

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    event.preventDefault();
    emit("update:modelValue", inputValue.value);
    emit("save", inputValue.value);
    inputRef.value?.blur();
  } else if (event.key === "Escape") {
    event.preventDefault();
    inputValue.value = props.modelValue; // Revert to original value
    emit("cancel");
    inputRef.value?.blur();
  }
};

const handleBlur = () => {
  emit("update:modelValue", inputValue.value);
  emit("save", inputValue.value);
};

const handleFocus = (event: FocusEvent) => {
  const target = event.target as HTMLInputElement;
  target.select();
};
</script>

<template>
  <input
    ref="inputRef"
    v-model="inputValue"
    type="text"
    :placeholder="placeholder"
    class="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    @keydown="handleKeydown"
    @blur="handleBlur"
    @focus="handleFocus"
  />
</template>
