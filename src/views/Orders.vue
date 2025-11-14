<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">My Orders</h1>

    <div v-if="loading" class="text-gray-500">Loading orders...</div>
    <div v-else-if="orders.length === 0" class="text-gray-600">
      You have no orders yet.
    </div>

    <div v-else class="grid gap-4">
      <div
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

const userAuth = useAuthStore();
const authRaw = localStorage.getItem('auth') || userAuth.user;
const auth = JSON.parse(authRaw);
const userId = auth?.user?.id ; 
const orders = ref([]);
const loading = ref(true);

const fetchOrders = async () => {
  try {console.log(userId)
    const res = await api.get(`/api/orders/user/${userId}`);
   orders.value = res.data;
  } catch (err) {
    console.error("Error fetching orders:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchOrders);
</script>