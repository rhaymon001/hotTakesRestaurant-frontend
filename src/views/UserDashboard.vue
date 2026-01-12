<template>
  <div class="dashboard">
    <!-- Sidebar / Topbar -->
    <aside class="sidebar">
      <h2 class="logo">
        <User class="w-5 h-5" />
        <span class="hidden sm:inline">Dashboard</span>
      </h2>

      <nav class="menu">
        <RouterLink to="/dashboard/orders" class="menu-item" active-class="active">
          <ClipboardList />
          <span class="label">Orders</span>
        </RouterLink>

        <RouterLink to="/dashboard/settings" class="menu-item" active-class="active">
          <Settings />
          <span class="label">Settings</span>
        </RouterLink>
      </nav>

      <!-- 🔻 Logout -->
      <button class="logout-btn" @click="logout">
        <LogOut class="w-5 h-5" />
        <span class="label">Logout</span>
      </button>
    </aside>

    <!-- Main Content -->
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView , useRouter} from 'vue-router'
import { ClipboardList, Settings, User , LogOut} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth';

const router = useRouter()
const auth = useAuthStore()

const logout = () => {
  auth.clearAuth?.() || localStorage.removeItem('auth')
  router.replace('/login')
}
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background: #f9fafb;
  font-family: Inter, system-ui, sans-serif;
}

/* ===== Sidebar (Desktop) ===== */
.sidebar {
  width: 250px;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  margin-bottom: 32px;
  background: #fff7ed;
  color: #ea580c;
  border-radius: 12px;
  font-weight: 600;
  font-size: 18px;
}

/* Menu */
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

/* ===== Content ===== */
.content {
  flex: 1;
  padding: 32px;
}

/* ===============================
   📱 Mobile adjustments
   =============================== */
@media (max-width: 768px) {
  .dashboard {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    align-items: center;
    padding: 12px 16px;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }

  .logo {
    margin-bottom: 0;
    padding: 8px 12px;
    font-size: 16px;
  }

  .menu {
    flex-direction: row;
    gap: 6px;
    margin-left: auto;
  }

  .menu-item {
    padding: 10px;
    gap: 0;
  }

  .menu-item .label {
    display: none;
  }

  .content {
    padding: 16px;
  }
}

/* Logout button */
.logout-btn {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  background: transparent;
  border: none;
  color: #dc2626;
  font-size: 15px;
  cursor: pointer;
  transition: 0.15s;
}

.logout-btn:hover {
  background: #fef2f2;
}

/* ===============================
   📱 Mobile adjustments
   =============================== */
@media (max-width: 768px) {
  .logout-btn {
    margin-top: 0;
    padding: 10px;
  }

  .logout-btn .label {
    display: none;
  }
}

</style>
