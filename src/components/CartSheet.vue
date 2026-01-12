<template>
  <transition name="slide-up">
    <div v-if="open" class="fixed inset-0 z-50">
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/40"
        @click="close"
      />

      <!-- Sheet -->
      <div
        class="absolute bottom-0 left-0 right-0 bg-white
               rounded-t-2xl p-4 max-h-[80vh] overflow-y-auto"
      >
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold">Your Cart</h2>
          <button @click="close">✕</button>
        </div>

        <!-- Items -->
        <div v-if="cart.length">
          <div
            v-for="item in cart"
            :key="item._id"
            class="flex justify-between items-center mb-3"
          >
            <div>
              <p class="font-medium">{{ item.name }}</p>
              <p class="text-sm text-gray-500">${{ item.price }}</p>
            </div>

            <!-- Quantity controls -->
            <div class="flex items-center gap-2">
              <button @click="updateQuantity(item._id, item.quantity - 1)">−</button>
              <span>{{ item.quantity }}</span>
              <button @click="updateQuantity(item._id, item.quantity + 1)">+</button>
            </div>
          </div>
        </div>

        <!-- Empty -->
        <p v-else class="text-center text-gray-500">
          Cart is empty
        </p>

        <!-- Footer -->
        <div class="mt-6">
          <p class="font-bold mb-3">
            Total: ${{ total }}
          </p>

          <RouterLink
            to="/checkout"
            class="block text-center bg-green-600 text-white py-3 rounded-lg"
            @click="close"
          >
            Checkout
          </RouterLink>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { useCart } from '@/composables/useCart'

const props = defineProps({
  open: Boolean
})
const emit = defineEmits(['close'])

const { cart, updateQuantity, total } = useCart()

const close = () => emit('close')
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.25s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
