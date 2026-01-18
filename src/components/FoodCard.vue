<template>
  <div
    class="
      bg-white border border-gray-200 rounded-lg shadow
      flex flex-col
      w-full max-w-sm
      hover:shadow-lg transition-shadow duration-300
    "
  >
    <img
      class="rounded-t-lg h-48 w-full object-cover"
      :src="food.imageUrl"
      alt="food item"
    />

    <div class="p-5 flex flex-col flex-1">
      <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900">
        {{ food.name }}
      </h5>

      <p class="mb-4 text-sm text-gray-700 line-clamp-3">
        {{ food.description }}
      </p>

      <div class="mt-auto flex justify-between items-center">
        <span class="text-lg font-bold text-gray-900">
          ₦{{ food.price }}
        </span>

        <slot />
      </div>
    </div>
  </div>
</template>


<script setup>
const props = defineProps({
  food: {
    type: Object,
    required: true,
  },
})
</script>
