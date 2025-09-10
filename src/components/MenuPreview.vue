<template>
  <div class="min-h-screen bg-blue-200 font-serif">
    <div class="flex justify-center items-center py-10">
      <h1 class="text-center font-serif text-3xl py-4 text-teal-950">Special Menu</h1>
    </div>
    <div class="flex h-[80%] pb-10 justify-evenly flex-wrap gap-3 px-10">
      <FoodCard v-for="food in foods" :food="food" :key="food.id">
        <itemButtonMorph
          :quantity="getQuantity(food.id)"
          @updateQuantity="(q) => updateQuantity(food.id, q)"
          @add="() => addItem(food)"
        />
      </FoodCard>
    </div>
    <div class="flex justify-center">
      <RouterLink
        :to="{ name: 'Menu' }"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-10 py-4 me-2 mb-2 dark:bg-teal-900 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        See All Dishes
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import FoodCard from './FoodCard.vue'
import { useFoods } from '@/composables/useFoods'
import { useCart } from '@/composables/useCart'
import itemButtonMorph from './itemButtonMorph.vue'

const { foods } = useFoods()
const { addItem, updateQuantity, cart } = useCart()

// helper
const getQuantity = (id) => {
  const found = cart.value.find((i) => i.id === id)
  return found ? found.quantity : 0
}
</script>
