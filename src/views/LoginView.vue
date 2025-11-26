<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Left side: branding -->
    <div
      class="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white items-center justify-center"
    >
      <div class="text-center px-6">
        <h1 class="text-4xl font-bold mb-4">🍽️ MyRestaurant</h1>
        <p class="text-lg leading-relaxed">
          Manage your orders, explore delicious meals, and enjoy a seamless food experience with us.
        </p>
      </div>
    </div>

    <!-- Right side: login form -->
    <div class="flex w-full md:w-1/2 items-center justify-center">
      <div class="bg-white shadow-lg rounded-2xl w-11/12 md:w-3/4 lg:w-2/3 p-8">
        <!-- Heading -->
        <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">Welcome Back</h2>
        <p class="text-center text-gray-500 mb-8">Login to your account to continue</p>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="you@example.com"
              class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              placeholder="********"
              class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
            />
          </div>

          <!-- Remember + Forgot -->
          <div class="flex items-center justify-between">
            <label class="flex items-center text-sm text-gray-600">
              <input type="checkbox" class="mr-2" />
              Remember me
            </label>
            <a href="#" class="text-sm text-blue-600 hover:underline"> Forgot password? </a>
          </div>

          <!-- Submit -->
          <button
            v-if="!loading"
            type="submit"
            class="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring focus:ring-green-200 transition"
          >
            Login
          </button>

          <!-- Loader -->
          <div v-else class="flex justify-center">
            <svg
              class="animate-spin h-6 w-6 text-blue-600"
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
          Don’t have an account?
          <router-link to="/register" class="text-blue-600 hover:underline"> Sign up </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import axios from 'axios'
import api from '@/api/api.js'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const loading = ref(false)
const authStore = useAuthStore()

const handleLogin = async () => {
  try {
    if(!password.value || !email) return alert("Enter email and password!")
    loading.value = true

   
    const res = await api.post(`/login`, {
      email: email.value,
      password: password.value,
    })

    if (res.data?.accessToken) {
      // Create a clean auth object
      const authData = {
        user: {
          id: res.data.id,
          email: res.data.email,
          role: res.data.role,
          name: res.data.name
        },
        accessToken: res.data.accessToken,
      }

      // Save to localStorage
      localStorage.setItem('auth', JSON.stringify(authData))

      // Update Pinia store (authStore)
      authStore.setAuth(authData.user, authData.accessToken)

      // Redirect to intended page or home
      const redirectPath = route.query.redirect || '/'
      router.push(redirectPath)
    } else {
      alert('Login failed. Please try again.')
    }
  } catch (err) {
    console.error(err)
    alert(err.response?.data?.message || 'something went wrong!')
  } finally {
    loading.value = false
  }
}
</script>
