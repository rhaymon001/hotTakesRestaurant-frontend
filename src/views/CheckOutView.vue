<script setup>
import DeliveryForm from '@/components/DeliveryForm.vue'
import PickUpForm from '@/components/PickUpForm.vue'
import { useCart } from '@/composables/useCart'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/orderType'
const order = useOrderStore()

const { cart } = useCart()
const router = useRouter()

// Total
const total = computed(() => cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0))
const deliveryFee = computed(() => (order.orderType === 'delivery' ? 500 : 0))

const proceedToPayment = () => {
  console.log('Delivery Info:', order.deliveryDetails)
  // validate before sending to backend
  if (!order.deliveryDetails.address && !order.deliveryDetails.phone) {
    alert('Please complete your delivery details before proceeding.')
    return
  }

  // proceed to payment gateway, e.g.:
  alert('Proceeding to payment 💳')
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-10 px-6">
    <h1 class="text-3xl font-bold text-center text-teal-900 mb-8">
      Checkout ({{ order.orderType.toUpperCase() }})
    </h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Delivery Info Form -->
      <PickUpForm v-if="order.orderType === 'pickup'" />
      <DeliveryForm v-else />
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
            <span class="text-lg font-bold">${{ total + deliveryFee }}</span>
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
