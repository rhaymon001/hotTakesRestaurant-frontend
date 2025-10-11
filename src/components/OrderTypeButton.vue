<template>
  <button
    @click="showModal = true"
    class="block py-2 px-3 md:p-0 dark:text-white relative pb-1 transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-green-600 after:transition-all after:duration-300 hover:after:w-full"
  >
    {{ order.orderType === 'pickup' ? 'Pickup' : 'Delivery' }}
  </button>

  <OrderTypeModal :show="showModal" @close="showModal = false" />
</template>

<script setup>
import { ref } from 'vue'
import { useOrderStore } from '@/stores/orderType'
import OrderTypeModal from '@/components/OrderTypeModal.vue'

const order = useOrderStore()
const showModal = ref(false)
</script>
