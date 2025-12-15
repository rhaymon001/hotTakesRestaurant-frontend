<script setup>
import { ref } from 'vue'
import { Lock } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const token = route.params.token

const password = ref('')
const confirmPassword = ref('')

const loading = ref(false)
const success = ref('')
const error = ref('')

const submit = async () => {
  error.value = ''
  success.value = ''

  if (!password.value || !confirmPassword.value) {
    error.value = 'Please fill in all fields'
    return 
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
console.log(token)
  try {
    loading.value = true
    const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
    await axios.post(`${baseUrl}/auth/reset-password/${token}`, {
      newPassword: password.value
    })

    success.value = 'Password reset successfully. Redirecting to login...'
    toast.success(success.value)

    setTimeout(() => {
      router.push('/login')
    }, 2000)

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
            <Lock class="text-blue-600 w-6 h-6"/>
          </div>
        </div>
        <h1 class="text-2xl font-bold text-gray-800">Reset your password</h1>
        <p class="text-gray-500 text-sm">
          Create a new secure password
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
          <label class="text-sm text-gray-600">New password</label>
          <input
            type="password"
            v-model="password"
            placeholder="Enter new password"
            class="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label class="text-sm text-gray-600">Confirm password</label>
          <input
            type="password"
            v-model="confirmPassword"
            placeholder="Confirm new password"
            class="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50 transition"
        >
          {{ loading ? 'Resetting...' : 'Reset password' }}
        </button>

      </form>
    </div>
  </div>
</template>
