<template>
  <div class="p-6">
    
    <!-- Header + Refresh Button -->
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">My Orders</h1>

      <!-- Refresh Button -->
      <button
        @click="refreshOrderStatusHandler"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-all duration-200 flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-5 h-5 animate-spin"
          v-if="loadingRefresh"
        >
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M4 4v6h6M20 20v-6h-6M5.64 5.64A9 9 0 0118.36 18.36M18.36 5.64A9 9 0 015.64 18.36" />
        </svg>

        <span v-if="!loadingRefresh">Refresh</span>
        <span v-else>Refreshing...</span>
      </button>
    </div>

    <div v-if="loading" class="text-gray-500">Loading orders...</div>
    <div v-else-if="orders.length === 0" class="text-gray-600">
      You have no orders yet.
    </div>

    <div v-else class="grid gap-4">
      <div v-auto-animate
        v-for="order in orders"
        :key="order._id"
        class="border rounded-2xl p-4 shadow-sm hover:shadow-md transition"
      >
        <h2 class="font-semibold mb-2">
          Order #{{ order._id.slice(-6).toUpperCase() }}
        </h2>
        
        <p class="text-sm text-gray-500">
          {{ new Date(order.createdAt).toLocaleString() }}
        </p>

        <div class="mt-2">
          <p>Total: <strong>₦{{ order.totalAmount.toLocaleString() }}</strong></p>
          <p>Status: 
            <span
              :class="{
                'text-green-600': order.status === 'completed',
                'text-yellow-600': order.status === 'processing',
                'text-red-600': order.status === 'cancelled',
              }"
              class="font-semibold"
            >
              {{ order.status }}
            </span>
          </p>
          <p>Payment: {{ order.payment.status }}</p>
        </div>

        <div class="mt-3 border-t pt-2">
          <h3 class="font-semibold mb-1">Items:</h3>
          <ul class="list-disc list-inside text-sm text-gray-700">
            <li
              v-for="item in order.items"
              :key="item._id"
            >
              {{ item.name }} × {{ item.quantity }} — ₦{{ item.price }}
            </li>
          </ul>
        </div>
        
      </div>
    </div>

  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import api from "@/api/api";
import { usePayment } from "@/composables/usePayment";

const userAuth = useAuthStore();
const authRaw = localStorage.getItem('auth') || userAuth.user;
const auth = JSON.parse(authRaw);
const userId = auth?.user?.id ; 
const orders = ref([]);
const loading = ref(true);
const loadingRefresh = ref(false);


const fetchOrders = async () => {
  try {
    const res = await api.get(`/api/orders/user/${userId}`);
   orders.value = res.data;
  } catch (err) {
    console.error("Error fetching orders:", err);
  } finally {
    loading.value = false;
  }
};
const refreshOrderStatusHandler = async () => {
  try {
    loadingRefresh.value = true;
    await fetchOrders(); // simply refetch
  } catch (err) {
    console.error("Refresh failed:", err);
  } finally {
    loadingRefresh.value = false;
  }
};

onMounted(fetchOrders);
</script>