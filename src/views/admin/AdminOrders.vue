<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">All Orders</h1>

    <div v-if="loading" class="text-gray-500">Loading orders...</div>
    <div v-else-if="orders.length === 0" class="text-gray-600">No orders yet.</div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full bg-white border rounded-lg">
        <thead class="bg-gray-100 border-b">
          <tr>
            <th class="text-left p-3">User</th>
            <th class="text-left p-3">Total</th>
            <th class="text-left p-3">Status</th>
            <th class="text-left p-3">Payment</th>
            <th class="text-left p-3">Created</th>
            <th class="text-left p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order._id" class="border-b hover:bg-gray-50">
            <td class="p-3">{{ order.user?.name || 'Unknown' }}</td>
            <td class="p-3">₦{{ order.totalAmount.toLocaleString() }}</td>
            <td class="p-3">
              <select
                v-model="order.status"
                @change="updateStatus(order._id, order.status)"
                class="border rounded px-2 py-1"
              >
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </td>
            <td class="p-3">{{ order.payment.status }}</td>
            <td class="p-3 text-sm text-gray-600">
              {{ new Date(order.createdAt).toLocaleString() }}
            </td>
            <td class="p-3">
              <button
                @click="viewOrder(order._id)"
                class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/api'

const router = useRouter()
const orders = ref([])
const loading = ref(true)

const fetchOrders = async () => {
  try {
    const res = await api.get('/api/orders')
    orders.value = res.data
  } catch (err) {
    console.error('Error fetching orders:', err)
  } finally {
    loading.value = false
  }
}

const updateStatus = async (orderId, status) => {
  try {
    await api.put(`/api/orders/${orderId}/status`, { status })
  } catch (err) {
    console.error('Failed to update status:', err)
  }
}

const viewOrder = (orderId) => {
  // Example: navigate to order details page
  router.push({ name: 'order-details', params: { id: orderId } })
  console.log(orderId)
}

onMounted(fetchOrders)
</script>
