<template>
  <div class="bg-white shadow-md rounded-lg p-6">
    <h2 class="text-xl font-semibold mb-4">Delivery Information</h2>

    <form class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          v-model="form.name"
          type="text"
          class="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Phone Number</label>
        <input
          v-model="form.phone"
          type="tel"
          class="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="08012345678"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Delivery Address</label>
        <textarea
          v-model="form.address"
          rows="3"
          class="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Enter your delivery address"
        ></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Additional notes</label>
        <textarea
          v-model="form.note"
          rows="3"
          class="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Enter additional information"
        ></textarea>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { watch } from 'vue'
import { useOrderStore } from '@/stores/orderType'

const order = useOrderStore()

const form = reactive({
  name: '',
  phone: '',
  address: '',
  note: '',
})

watch(
  form,
  (newVal) => {
    order.setDeliveryDetails(newVal, 'delivery')
  },
  { deep: true },
)
</script>
