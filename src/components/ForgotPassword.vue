<script setup>
import { ref } from 'vue'
import { Mail } from 'lucide-vue-next'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const toast = useToast()
const email = ref('')
const loading = ref(false)
const success = ref('')
const error = ref('')

const submit = async () => {
  error.value = ''
  success.value = ''

  if (!email.value) {
    error.value = 'Please enter your email address'
    return
  }

  try {
    const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
    loading.value = true
    await axios.post(`${baseUrl}/auth/request-password-reset`, { email: email.value })

    success.value = 'password reset link has been sent to your email.'
    toast.success(success.value)
    email.value = ''
  } catch (err) {
    error.value = err.response?.data?.message || 'Something went wrong'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}
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
          Enter your email and we’ll send you a reset link.
        </p>
      </div>

      <!-- Alerts -->
      <div v-if="error" class="bg-red-50 text-red-600 py-2 px-3 rounded text-sm">
        {{ error }}
      </div>

      <div v-if="success" class="bg-green-50 text-green-600 py-2 px-3 rounded text-sm">
        {{ success }}
      </div>

      <!-- Form -->
      <form @submit.prevent="submit" class="space-y-4">

        <div>
          <label class="text-sm text-gray-600">Email address</label>
          <input
            type="email"
            v-model="email"
            placeholder="example@email.com"
            class="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50 transition"
        >
          {{ loading ? 'Sending link...' : 'Send reset link' }}
        </button>

      </form>

      <!-- Back to login -->
      <div class="text-center text-sm text-gray-500">
        Remember your password?
        <RouterLink to="/login" class="text-blue-600 hover:underline">
          Back to login
        </RouterLink>
      </div>

    </div>

  </div>
</template>
