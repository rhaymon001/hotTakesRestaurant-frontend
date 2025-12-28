<template>
  <section class="bg-blue-200 font-serif py-12 px-4 sm:px-8">
    <!-- Title -->
    <div class="text-center mb-10">
      <h1 class="text-2xl sm:text-3xl font-bold text-teal-950">
        Special Menu
      </h1>
    </div>

    <!-- Skeleton Loader -->
    <div
      v-if="loading"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <div
        v-for="n in 8"
        :key="n"
        class="h-64 bg-white/60 rounded-xl animate-pulse"
      ></div>
    </div>

    <!-- Food Grid -->
<div
  class="
    grid
    grid-cols-1
    sm:grid-cols-2
    md:grid-cols-3
    lg:grid-cols-4
    gap-6
    px-6
    pb-10
  "
>
  <FoodCard
    v-for="food in previewFoods"
    :key="food._id"
    :food="food"
  >
    <itemButtonMorph
      :quantity="getQuantity(food._id)"
      @updateQuantity="(q) => updateQuantity(food._id, q)"
      @add="() => addItem(food)"
    />
  </FoodCard>
</div>


    <!-- CTA -->
    <div class="flex justify-center mt-12">
      <RouterLink
        :to="{ name: 'Menu' }"
        class="bg-blue-700 hover:bg-blue-800 transition
               text-white font-medium rounded-lg text-sm sm:text-base
               px-8 py-4"
      >
        See All Dishes
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { onMounted, ref,computed } from 'vue'
import { useFoods } from '@/composables/useFoods'
import { useCart } from '@/composables/useCart'
import itemButtonMorph from './itemButtonMorph.vue'
import FoodCard from './FoodCard.vue'

const loading = ref(true)

const previewFoods = computed(() => foods.value.slice(0, 8))

const { foods, fetchFoods } = useFoods()
const { addItem, updateQuantity, cart } = useCart()

const getQuantity = (id) => {
  const found = cart.value.find((i) => i._id === id)
  return found ? found.quantity : 0
}

onMounted(async () => {
  await fetchFoods()
  loading.value = false
})
</script>
