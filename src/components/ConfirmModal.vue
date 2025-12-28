<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-[90%] max-w-md animate-fadeIn">
      <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">{{ title }}</h2>
      <p class="text-gray-600 dark:text-gray-300 mb-6">{{ message }}</p>

      <div class="flex justify-end gap-3">
        <button
          @click="cancel"
          class="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
        >
          Cancel
        </button>

        <button
          @click="confirm"
          class="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, default: "Confirm Action" },
  message: { type: String, default: "Are you sure you want to continue?" }
});

const emit = defineEmits(["update:modelValue", "confirm"]);

const cancel = () => {
  emit("update:modelValue", false);
};

const confirm = () => {
  emit("confirm");
  emit("update:modelValue", false);
};
</script>

<style>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}
</style>
