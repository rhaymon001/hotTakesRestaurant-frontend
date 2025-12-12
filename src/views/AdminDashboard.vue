<script setup>
import { useRouter } from 'vue-router'
import {
  Settings,
  ShoppingBag,
  ClipboardList,
  Users
} from 'lucide-vue-next'

const router = useRouter()
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">

    <!-- Sidebar (BLUE) -->
    <aside class="w-64 bg-blue-700 text-white p-6">
      <h2 class="text-xl font-bold mb-8 text-white">
        Admin Dashboard
      </h2>

      <nav class="space-y-4">
        <button @click="router.push('/admin/foods')" class="side-link">
          <ShoppingBag /> Foods
        </button>

        <button @click="router.push('/admin/orders')" class="side-link">
          <ClipboardList /> Orders
        </button>

        <button @click="router.push('/admin/users')" class="side-link">
          <Users /> Users
        </button>

        <button @click="router.push('/admin/settings')" class="side-link">
          <Settings /> Settings
        </button>
      </nav>
    </aside>

    <!-- Main -->
    <main class="flex-1 p-10">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.side-link {
  @apply flex items-center gap-3 w-full text-white py-2 px-3 rounded hover:bg-blue-600 transition;
}
</style>
