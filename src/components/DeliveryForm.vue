<template>
  <div class="bg-white shadow-md rounded-lg p-6">
    <h2 class="text-xl font-semibold mb-4">Delivery Information</h2>
    <form class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          v-model="name"
          type="text"
          class="mt-1 block w-full border rounded-lg px-3 py-2"
          :class="{ 'border-red-500': errors.name, 'border-gray-300': !errors.name }"
          placeholder="John Doe"
        />
        <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Phone Number</label>
        <input
          v-model="phone"
          type="tel"
          class="mt-1 block w-full border rounded-lg px-3 py-2"
          :class="{ 'border-red-500': errors.phone, 'border-gray-300': !errors.phone }"
          placeholder="08012345678"
        />
        <p v-if="errors.phone" class="text-red-500 text-sm mt-1">{{ errors.phone }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Delivery Address</label>
        <textarea
          v-model="address"
          rows="3"
          class="mt-1 block w-full border rounded-lg px-3 py-2"
          :class="{ 'border-red-500': errors.address, 'border-gray-300': !errors.address }"
          placeholder="Enter your delivery address"
        ></textarea>
        <p v-if="errors.address" class="text-red-500 text-sm mt-1">{{ errors.address }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Additional notes (optional)</label>
        <textarea
          v-model="note"
          rows="3"
          class="mt-1 block w-full border rounded-lg px-3 py-2"
          :class="{ 'border-red-500': errors.note, 'border-gray-300': !errors.note }"
          placeholder="e.g., Call when you arrive, leave at door"
        ></textarea>
        <p v-if="errors.note" class="text-red-500 text-sm mt-1">{{ errors.note }}</p>
      </div>
    </form>
  </div>
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
    .required('Full name is required')
    .min(3, 'Name should be at least 3 characters long'),
  
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^0[789][01]\d{8}$/, 'Please enter a valid Nigerian phone number (e.g., 08012345678)'),
  
  address: yup
    .string()
    .required('Delivery address is required')
    .min(10, 'Please provide a detailed address (at least 10 characters)'),
  
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
    address: '',
    note: ''
  }
})

// Register fields
const { value: name } = useField('name')
const { value: phone } = useField('phone')
const { value: address } = useField('address')
const { value: note } = useField('note')

// Watch form values and sync with store
watch(
  values,
  (newVal) => {
    order.setDeliveryDetails(newVal, 'delivery')
  },
  { deep: true }
)

// ✨ CORRECT WAY: Create a validate function that returns a Promise
const validate = () => {
  return new Promise((resolve, reject) => {
    handleSubmit(
      (validValues) => {
        // Validation passed
        console.log('✅ Delivery form validation passed:', validValues)
        resolve(validValues)
      },
      (validationErrors) => {
        // Validation failed
        console.log('❌ Delivery form validation failed:', validationErrors)
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