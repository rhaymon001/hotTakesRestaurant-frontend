<template>
  <div class="p-6">
    <button
                @click="goBack()"
                class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 float-right"
              >
                <-back
              </button>
    <h1 class="text-2xl font-bold mb-4">Order Details</h1>
     
    <div v-if="loading" class="text-gray-600">Loading order...</div>
    <div v-else-if="!order" class="text-red-600">Order not found.</div>

    <div v-else class="bg-white p-6 rounded-2xl shadow-lg space-y-6">
      <!-- Order Header -->
      <div>
        <h2 class="text-xl font-semibold">Order #{{ order._id.toUpperCase() }}</h2>
        <p class="text-gray-500 text-sm">Created: {{ formatDate(order.createdAt) }}</p>
      </div>

      <!-- User Info (Admin Only) -->
      <div v-if="isAdmin" class="border p-4 rounded-lg bg-gray-50">
        <h3 class="font-semibold text-lg mb-2">Customer Information</h3>
        <p><strong>Name:</strong> {{ order.user?.name || 'Unknown' }}</p>
        <p><strong>Email:</strong> {{ order.user?.email || 'N/A' }}</p>
      </div>

      <!-- Items -->
      <div>
        <h3 class="font-semibold text-lg mb-3">Items Ordered</h3>
        <div class="space-y-2">
          <div v-for="item in order.items" :key="item._id" class="border rounded-xl p-4 bg-gray-50">
            <p class="font-semibold">{{ item.name }}</p>
            <p class="text-sm">Quantity: {{ item.quantity }}</p>
            <p class="text-sm">Price: ₦{{ item.price.toLocaleString() }}</p>
          </div>
        </div>
      </div>

      <!-- Payment -->
      <div class="border p-4 rounded-xl bg-gray-50">
        <h3 class="font-semibold text-lg mb-2">Payment Info</h3>
        <p><strong>Status:</strong> {{ order.payment.status }}</p>
        <p><strong>Reference:</strong> {{ order.payment.reference }}</p>
      </div>

      <!-- Order Summary -->
      <div class="border p-4 rounded-xl bg-gray-50">
        <h3 class="font-semibold text-lg mb-2">Summary</h3>
        <p><strong>Total Amount:</strong> ₦{{ order.totalAmount.toLocaleString() }}</p>
        <p>
          <strong>Status:</strong>
          <span
            :class="{
              'text-green-600': order.status === 'completed',
              'text-yellow-600': order.status === 'processing',
              'text-red-600': order.status === 'cancelled',
            }"
            class="font-bold"
          >
            {{ order.status }}
          </span>
        </p>
      </div>

      <!-- Admin: Update Status -->
      <div v-if="isAdmin" class="pt-4">
        <label class="block font-semibold mb-2">Update Status</label>
        <select
          v-model="order.status"
          @change="updateStatus(order._id, order.status)"
          class="border rounded-lg p-2"
        >
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/api/api'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'


const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const props = defineProps({
  id: { type: String },
})

console.log('ROUTE PARAMS:', route.params)
const order = ref(null)
const loading = ref(true)

const isAdmin = computed(()=> auth?.user?.role ==="admin")

const formatDate = (date) => new Date(date).toLocaleString()
function goBack(){
  router.back()
}

const fetchOrder = async () => {
  try {
    const orderId = route.params.id
    if (!orderId) return console.log(orderId)
    const res = await api.get(`/api/orders/${orderId}`)
    order.value = res.data
  } catch (err) {
    console.error('Error fetching order:', err)
  } finally {
    loading.value = false
  }
}

const updateStatus = async (orderId, status) => {
  try {
    await api.put(`/api/orders/${orderId}/status`, { status })
  } catch (err) {
    console.error('Failed to update:', err)
  }
}

onMounted(fetchOrder)
</script>
