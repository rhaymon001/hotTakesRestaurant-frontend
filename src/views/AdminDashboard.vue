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
  <div class="flex min-h-screen bg-gray-50 flex-col md:flex-row">

    <!-- Sidebar / Topbar -->
    <aside
      class="
        bg-blue-700 text-white
        w-full md:w-64
        p-4 md:p-6
        flex md:flex-col
        items-center md:items-start
        gap-6
      "
    >
      <h2 class="text-lg md:text-xl font-bold">
        Admin Dashboard
      </h2>

      <nav v-auto-animate
        class="
          flex md:flex-col
          gap-2 md:gap-3
          w-full md:w-auto
          justify-around md:justify-start
        "
      >
        <RouterLink to="/admin/foods" class="side-link">
          <ShoppingBag />
          <span class="hidden md:inline">Foods</span>
        </RouterLink>

        <RouterLink to="/admin/orders" class="side-link">
          <ClipboardList />
          <span class="hidden md:inline">Orders</span>
        </RouterLink>

        <RouterLink to="/admin/users" class="side-link">
          <Users />
          <span class="hidden md:inline">Users</span>
        </RouterLink>

        <RouterLink to="/admin/settings" class="side-link">
          <Settings />
          <span class="hidden md:inline">Settings</span>
        </RouterLink>
      </nav>
    </aside>

    <!-- Main -->
    <main class="flex-1 p-4 sm:p-6 md:p-10">
      <RouterView />
    </main>
  </div>
</template>


<style scoped>
.side-link {
  @apply
    flex items-center gap-3
    py-2 px-3 rounded-lg
    text-white
    transition
    hover:bg-blue-600
    focus:outline-none
    focus:ring-2 focus:ring-white/40;
}

/* Vue Router active class */
.side-link.router-link-active {
  @apply bg-white text-blue-700 font-semibold;
}

/* Mobile icon sizing */
.side-link svg {
  width: 20px;
  height: 20px;
}

</style>
