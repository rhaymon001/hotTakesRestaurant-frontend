<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-lg flex flex-col">
      <div class="p-6 text-2xl font-bold text-blue-600 border-b">Hi, {{firstName}}</div>
      <nav class="flex-1 p-4">
        <ul class="space-y-3">
          <li>
            <RouterLink :to="{ name: 'Orders' }" class="block p-2 rounded hover:bg-blue-100"
              >📦 Orders</RouterLink
            >
          </li>
          <li>
            <RouterLink :to="{ name: 'Settings' }" class="block p-2 rounded hover:bg-blue-100"
              >⚙️ Settings</RouterLink
            >
          </li>
        </ul>
      </nav>
      <div class="p-4 border-t">
        <button @click="logout" class="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 p-6 overflow-y-auto">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ref,} from 'vue'
import Settings from './Settings.vue'

const router = useRouter()
const auth = useAuthStore()
const firstName = ref("")


firstName.value = (auth?.user?.name.split(" ")[0] || "user")

function logout() {
  // clear token/localStorage
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}
</script>
