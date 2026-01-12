<template>
  <form class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700">Name</label>
      <input 
        v-model="name" 
        type="text" 
        class="input" 
        :class="{ 'border-red-500': errors.name }"
        placeholder="Enter your name" 
      />
      <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Phone Number</label>
      <input
        v-model="phone"
        type="tel"
        class="input"
        :class="{ 'border-red-500': errors.phone }"
        placeholder="Enter your phone number"
      />
      <p v-if="errors.phone" class="text-red-500 text-sm mt-1">{{ errors.phone }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Pickup Location</label>
      <select 
        v-model="pickupLocation" 
        class="input"
        :class="{ 'border-red-500': errors.pickupLocation }"
      >
        <option disabled value="">Select pickup point</option>
        <option value="Main Branch">Main Branch (123 Food Street)</option>
        <option value="Campus Kiosk">Campus Kiosk</option>
        <option value="Downtown Spot">Downtown Spot</option>
      </select>
      <p v-if="errors.pickupLocation" class="text-red-500 text-sm mt-1">{{ errors.pickupLocation }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Pickup Note (optional)</label>
      <textarea
        v-model="note"
        class="input"
        :class="{ 'border-red-500': errors.note }"
        rows="3"
        placeholder="e.g., Call me when it's ready"
      />
      <p v-if="errors.note" class="text-red-500 text-sm mt-1">{{ errors.note }}</p>
    </div>
  </form>
</template>

<script setup>
import { watch } from 'vue'
import { useOrderStore } from '@/stores/orderType'
import * as yup from 'yup'
import { useField, useForm } from 'vee-validate'

const order = useOrderStore()

// Validation schema
const schema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name should be at least 3 characters long'),
  
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[0-9]{11}$/, 'Phone number must be exactly 11 digits'),
  
  pickupLocation: yup
    .string()
    .required('Pickup location is required'),
  
  note: yup
    .string()
    .nullable()
})

// Setup form with validation
const { handleSubmit, errors, values } = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    phone: '',
    pickupLocation: '',
    note: ''
  }
})

// Register fields
const { value: name } = useField('name')
const { value: phone } = useField('phone')
const { value: pickupLocation } = useField('pickupLocation')
const { value: note } = useField('note')

// Watch form values and sync with store
watch(
  values,
  (newVal) => {
    order.setDeliveryDetails(newVal, 'pickup')
  },
  { deep: true }
)

// ✨ CORRECT WAY: Create a validate function that returns a Promise
const validate = () => {
  return new Promise((resolve, reject) => {
    handleSubmit(
      (validValues) => {
        // Validation passed
        console.log('✅ PickUp form validation passed:', validValues)
        resolve(validValues)
      },
      (validationErrors) => {
        // Validation failed
        console.log('❌ PickUp form validation failed:', validationErrors)
        reject(validationErrors)
      }
    )() // ⚠️ IMPORTANT: Call the function immediately with ()
  })
}

// Expose the validate function to parent
defineExpose({
  validate
})
</script>

<style scoped>
.input {
  @apply w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500;
}
</style>
