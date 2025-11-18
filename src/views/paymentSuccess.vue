<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <div class="w-full max-w-2xl bg-white rounded-lg shadow p-6">
      <div v-if="loading" class="flex flex-col items-center gap-4">
        <svg class="animate-spin h-10 w-10" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25" />
          <path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" class="opacity-75" />
        </svg>
        <p class="text-gray-700">Verifying your payment... please wait.</p>
      </div>

      <div v-else-if="success" class="text-center">
        <svg class="mx-auto h-16 w-16 text-green-600" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h2 class="text-2xl font-semibold mt-4">Payment Successful</h2>
        <p class="mt-2 text-gray-600">Reference: <span class="font-mono">{{ reference }}</span></p>
        <p class="mt-2 text-gray-600">Order status: <span class="font-medium">{{ orderStatus }}</span></p>

        <div class="mt-6 flex justify-center gap-4">
          <button @click="goToOrders" class="px-4 py-2 bg-blue-600 text-white rounded">View Orders</button>
          <button @click="goHome" class="px-4 py-2 border rounded">Back to Home</button>
        </div>
      </div>

      <div v-else class="text-center">
        <svg class="mx-auto h-16 w-16 text-red-600" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h2 class="text-2xl font-semibold mt-4">Payment Not Confirmed</h2>
        <p class="mt-2 text-gray-600">We couldn't verify your payment automatically.</p>
        <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>

        <div class="mt-6 flex justify-center gap-4">
          <button @click="retry" class="px-4 py-2 bg-yellow-600 text-white rounded">Retry Verification</button>
          <button @click="contactSupport" class="px-4 py-2 border rounded">Contact Support</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/*
  PaymentSuccess.vue
  - Reads `reference` from query params (supports `reference`, `trxref`, `trxRef`).
  - Calls backend verify endpoint: `${VITE_API_URL}/api/payment/verify?reference=...`
  - Clears cart for current user if userId present in localStorage `auth` object.
  - Uses router to navigate to orders or home.
*/

import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePayment } from '@/composables/usePayment'
const router = useRouter()

const { verify, orderStatus, reference, loading, success,error } = usePayment()
// retry helper
const retry = () => verify()

const goToOrders = () => router.push({ name: 'Orders' }).catch(() => {})
const goHome = () => router.push({ name: 'Home' }).catch(() => {})
const contactSupport = () => {
  // you might change this phone or whatsapp link
  window.open('https://wa.me/2348122064512', '_blank')
}

onMounted(() => {
  verify()
})
</script>

<style scoped>
/* small, simple styling — adjust per your Tailwind or CSS framework */
</style>
