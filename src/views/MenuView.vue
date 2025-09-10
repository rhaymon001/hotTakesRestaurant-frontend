<template>
  <div class="p-6">
    <!-- Title -->
    <h1 class="text-2xl font-bold text-center mb-6">🍴 Our Menu</h1>

    <!-- Loading -->
    <div v-if="loading" class="text-center">Loading foods...</div>

    <!-- Food Grid -->
    <div v-else class="flex flex-wrap justify-center gap-6">
      <FoodCard v-for="food in foods" :key="food.id" :food="food">
        <itemButtonMorph
          :quantity="getQuantity(food.id)"
          @updateQuantity="(q) => updateQuantity(food.id, q)"
          @add="() => addItem(food)"
        />
      </FoodCard>
    </div>
  </div>
</template>

<script setup>
import FoodCard from '@/components/FoodCard.vue'
import { useFoods } from '@/composables/useFoods'
import { useCart } from '@/composables/useCart'
import itemButtonMorph from '@/components/itemButtonMorph.vue'

const { foods } = useFoods()
const { addItem, updateQuantity, cart } = useCart()

// helper
const getQuantity = (id) => {
  const found = cart.value.find((i) => i.id === id)
  return found ? found.quantity : 0
}
</script>