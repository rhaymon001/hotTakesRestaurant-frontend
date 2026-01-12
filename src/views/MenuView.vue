<template>
<div class="p-6">
  <h1 class="text-2xl sm:text-3xl font-bold text-center mb-6">🍴 Our Menu</h1>

  <!-- Loading Skeleton -->
  <div v-if="loading" class="flex flex-wrap justify-center gap-6">
    <div v-for="n in 10" :key="n" class="h-64 w-56 bg-gray-200 rounded-xl animate-pulse"></div>
  </div>

  <!-- Food Grid -->
  <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center max-w-6xl mx-auto">
    <FoodCard v-for="food in foods" :key="food._id" :food="food">
      <itemButtonMorph
        :quantity="getQuantity(food._id)"
        @updateQuantity="(q) => updateQuantity(food._id, q)"
        @add="() => addItem(food)"
      />
    </FoodCard>
  </div>
</div>

</template>

<script setup>
import FoodCard from '@/components/FoodCard.vue'
import { onMounted } from 'vue'
import { useFoods } from '@/composables/useFoods'
import { useCart } from '@/composables/useCart'
import itemButtonMorph from '@/components/itemButtonMorph.vue'

const { foods, loading, fetchFoods } = useFoods()
const { addItem, updateQuantity, cart } = useCart()

// helper
const getQuantity = (id) => {
  const found = cart.value.find((i) => i._id === id)
  return found ? found.quantity : 0
}
onMounted(() => {
  fetchFoods()
})
</script>
<style>
  .FoodCard {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 0.5s forwards;
}
.FoodCard:nth-child(1) { animation-delay: 0.1s; }
.FoodCard:nth-child(2) { animation-delay: 0.2s; }
/* ... etc ... */

</style>