<template>
  <RouterLink
    :to="{ name }"
    class="relative text-gray-700 dark:text-gray-200 hover:text-green-600 transition-colors pb-1
           after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-0
           after:bg-green-600 after:transition-all after:duration-300 hover:after:w-full"
    active-class="text-green-600 after:w-full"
  >
    {{ name }}
  </RouterLink>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  }
})
</script>
