<script setup>
import { useCart } from '@/composables/useCart'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const { cart } = useCart()
const router = useRouter()

// Simple form state
const name = ref('')
const phone = ref('')
const address = ref('')

// Total
const total = computed(() => cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0))

function proceedToPayment() {
  if (!name.value || !phone.value || !address.value) {
    alert('Please fill in all fields before continuing.')
    return
  }

  // Later: pass this info to backend or store globally
  console.log('Delivery Info:', { name: name.value, phone: phone.value, address: address.value })

  router.push('/payment') // temporary redirect
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-10 px-6">
    <h1 class="text-3xl font-bold text-center text-teal-900 mb-8">Checkout</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Delivery Info Form -->
      <div class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Delivery Information</h2>

        <form class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              v-model="name"
              type="text"
              class="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              v-model="phone"
              type="tel"
              class="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="08012345678"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Delivery Address</label>
            <textarea
              v-model="address"
              rows="3"
              class="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Enter your delivery address"
            ></textarea>
          </div>
        </form>
      </div>

      <!-- Order Summary -->
      <div class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Order Summary</h2>

        <div v-if="cart.length" class="space-y-4">
          <div
            v-for="item in cart"
            :key="item.id"
            class="flex justify-between items-center border-b pb-2"
          >
            <div>
              <h3 class="font-medium">{{ item.name }}</h3>
              <p class="text-sm text-gray-500">x {{ item.quantity }}</p>
            </div>
            <span class="font-semibold"> ${{ item.price * item.quantity }} </span>
          </div>

          <div class="flex justify-between items-center mt-6">
            <h3 class="text-lg font-bold">Total</h3>
            <span class="text-lg font-bold">${{ total }}</span>
          </div>

          <button
            @click="proceedToPayment"
            class="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg mt-6"
          >
            Proceed to Payment
          </button>
        </div>

        <div v-else class="text-gray-600 text-center py-10">Your cart is empty.</div>
      </div>
    </div>
  </div>
</template>
