<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700">Name</label>
      <input v-model="form.name" type="text" class="input" placeholder="Enter your name" required />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Phone Number</label>
      <input
        v-model="form.phone"
        type="tel"
        class="input"
        placeholder="Enter your phone number"
        required
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Pickup Location</label>
      <select v-model="form.pickupLocation" class="input" required>
        <option disabled value="">Select pickup point</option>
        <option value="Main Branch">Main Branch (123 Food Street)</option>
        <option value="Campus Kiosk">Campus Kiosk</option>
        <option value="Downtown Spot">Downtown Spot</option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Pickup Note (optional)</label>
      <textarea
        v-model="form.note"
        class="input"
        rows="3"
        placeholder="e.g., Call me when it’s ready"
      />
    </div>
  </form>
</template>

<script setup>
import { watch, reactive } from 'vue'
import { useOrderStore } from '@/stores/orderType'

const order = useOrderStore()

// initialize from store if user returns to form
const form = reactive({
  name: '',
  phone: '',
  pickupLocation: '',
  note: '',
})

watch(
  form,
  (newVal) => {
    order.setDeliveryDetails(newVal, 'pickup')
  },
  { deep: true },
)
</script>

<style scoped>
.input {
  @apply w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500;
}
</style>
