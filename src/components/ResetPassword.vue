<script setup>
import { ref, computed } from 'vue'
import { Lock } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const token = route.params.token
const loading = ref(false)
const success = ref('')

// Validation schema with strong password requirements
const schema = yup.object({
  password: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password cannot exceed 128 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  
  confirmPassword: yup
    .string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('password')], 'Passwords must match')
})

// Setup form with validation
const { handleSubmit, errors } = useForm({
  validationSchema: schema,
  initialValues: {
    password: '',
    confirmPassword: ''
  }
})

// Register fields
const { value: password } = useField('password')
const { value: confirmPassword } = useField('confirmPassword')

// Password strength calculator
const passwordStrength = computed(() => {
  if (!password.value) return 0
  
  let strength = 0
  const pwd = password.value
  
  if (pwd.length >= 8) strength += 1
  if (pwd.length >= 12) strength += 1
  if (/[a-z]/.test(pwd)) strength += 1
  if (/[A-Z]/.test(pwd)) strength += 1
  if (/[0-9]/.test(pwd)) strength += 1
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strength += 1
  
  return strength
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength <= 2) return 'Weak'
  if (strength <= 4) return 'Medium'
  return 'Strong'
})

const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value
  if (strength <= 2) return 'strength-weak'
  if (strength <= 4) return 'strength-medium'
  return 'strength-strong'
})

// Submit handler with validation
const onSubmit = handleSubmit(async (values) => {
  success.value = ''

  // Validate token exists
  if (!token) {
    toast.error('Invalid or missing reset token')
    return
  }

  console.log('Reset token:', token)

  try {
    loading.value = true
    const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
    
    await axios.post(`${baseUrl}/auth/reset-password/${token}`, {
      newPassword: values.password
    })

    success.value = 'Password reset successfully. Redirecting to login...'
    toast.success(success.value)
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
      router.push('/login')
    }, 2000)

  } catch (err) {
    console.error('Password reset error:', err)
    
    // Handle specific error cases
    if (err.response?.status === 400) {
      toast.error('Invalid or expired reset token. Please request a new one.')
    } else if (err.response?.status === 404) {
      toast.error('Reset token not found. Please request a new password reset.')
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
            <Lock class="text-blue-600 w-6 h-6"/>
          </div>
        </div>
        <h1 class="text-2xl font-bold text-gray-800">Reset your password</h1>
        <p class="text-gray-500 text-sm">
          Create a new secure password
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
        <!-- New Password -->
        <div>
          <label class="text-sm text-gray-600 font-medium">New password</label>
          <input
            type="password"
            v-model="password"
            placeholder="Enter new password"
            class="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            :class="{ 'border-red-500': errors.password, 'border-gray-300': !errors.password }"
          />
          <p v-if="errors.password" class="text-red-500 text-sm mt-1">
            {{ errors.password }}
          </p>
          
          <!-- Password strength indicator -->
          <div v-if="password" class="password-strength">
            Password strength: 
            <span :class="passwordStrengthClass">{{ passwordStrengthText }}</span>
          </div>
          
          <!-- Password requirements hint -->
          <div v-if="!password" class="text-xs text-gray-500 mt-2">
            Password must contain:
            <ul class="list-disc list-inside mt-1 space-y-0.5">
              <li>At least 8 characters</li>
              <li>Uppercase & lowercase letters</li>
              <li>At least one number</li>
              <li>At least one special character</li>
            </ul>
          </div>
        </div>

        <!-- Confirm Password -->
        <div>
          <label class="text-sm text-gray-600 font-medium">Confirm password</label>
          <input
            type="password"
            v-model="confirmPassword"
            placeholder="Confirm new password"
            class="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            :class="{ 'border-red-500': errors.confirmPassword, 'border-gray-300': !errors.confirmPassword }"
          />
          <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1">
            {{ errors.confirmPassword }}
          </p>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {{ loading ? 'Resetting...' : 'Reset password' }}
        </button>
      </form>

      <!-- Back to login link -->
      <div class="text-center text-sm text-gray-500">
        Remember your password?
        <RouterLink to="/login" class="text-blue-600 hover:underline font-medium">
          Back to login
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.password-strength {
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
}

.strength-weak {
  color: #ef4444;
  font-weight: 600;
}

.strength-medium {
  color: #f59e0b;
  font-weight: 600;
}

.strength-strong {
  color: #10b981;
  font-weight: 600;
}
</style>