<template>
  <div class="dashboard">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h2 class="logo flex items-center gap-2 px-4 py-2 mb-6 bg-orange-50 text-orange-600 rounded-lg font-semibold text-lg">
  <User class="w-5 h-5" />
  <span>Dashboard</span>
</h2>

      <nav class="menu">
        <RouterLink to="/dashboard/orders" class="menu-item" active-class="active">
          <ClipboardList />
          <span>Orders</span>
        </RouterLink>

        <RouterLink to="/dashboard/settings" class="menu-item" active-class="active">
          <Settings />
          <span>Settings</span>
        </RouterLink>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ClipboardList, Settings, User } from 'lucide-vue-next'
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background: #f9fafb;
  font-family: Inter, system-ui, sans-serif;
}

.sidebar {
  width: 250px;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  padding: 24px;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 32px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  text-decoration: none;
  color: #374151;
  font-size: 15px;
  transition: 0.15s;
}

.menu-item:hover {
  background: #f3f4f6;
}

.menu-item.active {
  background: #eef2ff;
  color: #4f46e5;
}

.content {
  flex: 1;
  padding: 32px;
}
</style>
