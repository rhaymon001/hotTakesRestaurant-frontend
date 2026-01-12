<!-- 📁 src/components/OrderTypeModal.vue -->
<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        class="  bg-white rounded-2xl shadow-xl
    w-[90%] max-w-sm
    mt-24 sm:mt-28 md:mt-96
    p-6 text-center space-y-4
    relative animate-fade-in"
      >
        <!-- Close button -->
        <button @click="close" class="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          ✕
        </button>

        <h2 class="text-xl font-bold text-gray-800">Choose Order Type</h2>
        <p class="text-gray-500 text-sm">
          Would you like to pick up your order or have it delivered?
        </p>

        <div class="flex justify-center gap-4 mt-4">
          <!-- Pickup -->
          <button
            :class="[
              'px-5 py-2 rounded-lg font-medium border',
              orderType === 'pickup'
                ? 'bg-teal-600 text-white border-teal-600'
                : 'border-gray-300 hover:border-teal-500 hover:text-teal-700',
            ]"
            @click="setType('pickup')"
          >
            Pickup
          </button>

          <!-- Delivery -->
          <button
            :class="[
              'px-5 py-2 rounded-lg font-medium border',
              orderType === 'delivery'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 hover:border-blue-500 hover:text-blue-700',
            ]"
            @click="setType('delivery')"
          >
            Delivery
          </button>
        </div>

        <button
          @click="close"
          class="mt-6 bg-gray-800 text-white px-6 py-2 rounded-lg w-full hover:bg-gray-700 transition"
        >
          Continue
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useOrderStore } from '@/stores/orderType'

const props = defineProps({
  show: Boolean,
})

const emit = defineEmits(['close'])
const order = useOrderStore()

const orderType = ref(order.orderType)

const setType = (type) => {
  order.setOrderType(type)
  orderType.value = type
}

const close = () => emit('close')

// optional: auto close when type is selected
watch(orderType, (val) => {
  if (val) setTimeout(close, 500)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
