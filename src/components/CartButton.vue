<template>
  <button
    @click="$emit('open')"
    class="fixed bottom-5 right-5 z-40 md:hidden
           bg-green-600 text-white rounded-full
           w-14 h-14 flex items-center justify-center shadow-lg"
  >
    <ShoppingCart class="w-6 h-6" />
    <span
      v-if="cartCount > 0"
      class="absolute -top-1 -right-1 bg-red-600 text-xs
             w-5 h-5 rounded-full flex items-center justify-center"
    >
      {{ cartCount }}
    </span>
  </button>
</template>

<script setup>
import { ShoppingCart } from 'lucide-vue-next'
import { useCart } from '@/composables/useCart'

const { cartCount } = useCart()
</script>
