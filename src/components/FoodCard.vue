<template>
  <div
    class="w-[20%] bg-white border border-gray-200 rounded-lg shadow mt-5 flex-col justify-around"
  >
    <img class="rounded-t-lg h-48 w-full object-cover" :src="food.imageUrl" alt="food item" />
    <div class="p-5">
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
        {{ food.name }}
      </h5>
      <p class="mb-3 font-normal text-gray-700">{{ food.description }}</p>
      <div class="flex justify-between items-end border">
        <span class="text-lg font-bold">${{ food.price }}</span>
        <slot></slot>
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
