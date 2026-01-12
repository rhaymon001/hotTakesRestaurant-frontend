<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Left side: branding -->
    <div
      class="hidden md:flex w-1/2 bg-gradient-to-br from-green-600 to-emerald-700 text-white items-center justify-center"
    >
      <div class="text-center px-6">
        <h1 class="text-4xl font-bold mb-4">🍽️ MyRestaurant</h1>
        <p class="text-lg leading-relaxed">
          Join us today! Order food, manage your account, and enjoy a seamless experience.
        </p>
      </div>
    </div>

    <!-- Right side: register form -->
    <div class="flex w-full md:w-1/2 items-center justify-center">
      <div class="bg-white shadow-lg rounded-2xl w-11/12 md:w-3/4 lg:w-2/3 p-8">
        <!-- Heading -->
        <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">Create Account</h2>
        <p class="text-center text-gray-500 mb-8">
          Sign up to start exploring our delicious meals 🍔
        </p>

        <!-- Form -->
        <form @submit="onSubmit" class="space-y-6">
          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              id="name"
              v-model="name"
              type="text"
              placeholder="John Doe"
              class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-green-200 focus:border-green-500"
              :class="{ 'border-red-500': errors.name }"
            />
            <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="you@example.com"
              class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-green-200 focus:border-green-500"
              :class="{ 'border-red-500': errors.email }"
            />
            <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="********"
              class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-green-200 focus:border-green-500"
              :class="{ 'border-red-500': errors.password }"
            />
            <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              placeholder="********"
              class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-green-200 focus:border-green-500"
              :class="{ 'border-red-500': errors.confirmPassword }"
            />
            <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1">{{ errors.confirmPassword }}</p>
          </div>

          <!-- Submit -->
          <button
            v-if="!loading"
            type="submit"
            class="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring focus:ring-green-200 transition"
          >
            Register
          </button>

          <!-- Loader -->
          <div v-else class="flex justify-center">
            <svg
              class="animate-spin h-6 w-6 text-green-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          </div>
        </form>

        <!-- Footer -->
        <p class="text-center text-sm text-gray-500 mt-6">
          Already have an account?
          <router-link to="/login" class="text-green-600 hover:underline"> Login here </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useToast } from 'vue-toastification'

const router = useRouter()
const loading = ref(false)
const toast = useToast()


// Validation schema with confirmPassword
const schema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name should be at least 3 characters long'),

  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),

  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password should be at least 6 characters long'),

  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match')
})

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
})

const { value: name } = useField('name')
const { value: email } = useField('email')
const { value: password } = useField('password')
const { value: confirmPassword } = useField('confirmPassword')

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true
    const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000'
    
    const res = await axios.post(`${baseUrl}/register`, {
      name: values.name,
      email: values.email,
      password: values.password,
    })

    if (res.status === 200 || res.status === 201) {
      console.log('Registration successful!', res.data)
      toast.success('Registration successful!')
      router.push('/login')
    }
  } catch (error) {
    console.error(error)
    if (error.response?.data?.message) {
      toast.error(error.response.data.message)
    } else {
      toast.error('Something went wrong. Please try again.')
    }
  } finally {
    loading.value = false
  }
})
</script>