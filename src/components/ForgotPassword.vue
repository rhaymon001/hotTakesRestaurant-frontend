<script setup>
import { ref } from 'vue'
import { Mail } from 'lucide-vue-next'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'

const router = useRouter()
const toast = useToast()
const loading = ref(false)
const success = ref('')

// Validation schema
const schema = yup.object({
  email: yup
    .string()
    .required('Email address is required')
    .email('Please enter a valid email address')
    .lowercase('Email must be lowercase')
    .max(100, 'Email cannot exceed 100 characters')
})

// Setup form with validation
const { handleSubmit, errors } = useForm({
  validationSchema: schema,
  initialValues: {
    email: ''
  }
})

// Register email field
const { value: email } = useField('email')

// Submit handler with validation
const onSubmit = handleSubmit(async (values) => {
  success.value = ''
  
  try {
    loading.value = true
    const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
    
    await axios.post(`${baseUrl}/auth/request-password-reset`, { 
      email: values.email.toLowerCase().trim() 
    })
    
    success.value = 'Password reset link has been sent to your email.'
    toast.success(success.value)
    
    // Clear email field after success
    email.value = ''
    
  } catch (err) {
    console.error('Password reset error:', err)
    
    // Handle specific error cases
    if (err.response?.status === 404) {
      toast.error('No account found with this email address')
    } else if (err.response?.status === 429) {
      toast.error('Too many requests. Please try again later.')
    } else if (err.response?.data?.message) {
      toast.error(err.response.data.message)
    } else if (err.code === 'ERR_NETWORK') {
      toast.error('Network error. Please check your connection.')
    } else {
      toast.error('Something went wrong. Please try again.')
    }
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow p-8 space-y-6">
      <!-- Header -->
      <div class="text-center space-y-2">
        <div class="flex justify-center">
          <div class="p-3 bg-blue-50 rounded-full">
            <Mail class="text-blue-600 w-6 h-6" />
          </div>
        </div>
        <h1 class="text-2xl font-bold text-gray-800">Forgot your password?</h1>
        <p class="text-gray-500 text-sm">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      <!-- Success Alert -->
      <div 
        v-if="success" 
        class="bg-green-50 text-green-600 py-3 px-4 rounded-lg text-sm border border-green-200"
      >
        {{ success }}
      </div>

      <!-- Form -->
      <form @submit="onSubmit" class="space-y-4">
        <div>
          <label class="text-sm text-gray-600 font-medium">Email address</label>
          <input
            type="email"
            v-model="email"
            placeholder="example@email.com"
            class="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            :class="{ 'border-red-500': errors.email, 'border-gray-300': !errors.email }"
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">
            {{ errors.email }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {{ loading ? 'Sending link...' : 'Send reset link' }}
        </button>
      </form>

      <!-- Back to login -->
      <div class="text-center text-sm text-gray-500">
        Remember your password?
        <RouterLink to="/login" class="text-blue-600 hover:underline font-medium">
          Back to login
        </RouterLink>
      </div>
    </div>
  </div>
</template>