<template>
  <div class="p-6">
    <!-- Title -->
    <h1 class="text-2xl font-bold text-center mb-6">🍴 Our Menu</h1>

    <!-- Loading -->
    <div v-if="loading" class="text-center">Loading foods...</div>

    <!-- Food Grid -->
    <div v-else class="flex flex-wrap justify-center gap-6">
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
