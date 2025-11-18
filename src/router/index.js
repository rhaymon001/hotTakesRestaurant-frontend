import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import MenuView from '@/views/MenuView.vue'
import CartView from '@/views/CartView.vue'
import CheckOutView from '@/views/CheckOutView.vue'

// Admin layout + children
import AdminDashboard from '@/views/AdminDashboard.vue'
import Foods from '@/views/admin/Foods.vue'
import AdminOrders from '@/views/admin/AdminOrders.vue'
import Users from '@/views/admin/Users.vue'
import AdminSettings from '@/views/admin/AdminSettings.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import UserDashboard from '@/views/UserDashboard.vue'
import Orders from '@/views/Orders.vue'
import Settings from '@/views/Settings.vue'
import PaymentSuccess from '@/views/paymentSuccess.vue'
import OrderDetails from '@/views/admin/OrderDetails.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'About',
      component: AboutView,
    },
    {
      path: '/menu',
      name: 'Menu',
      component: MenuView,
    },
    {
      path: '/cart',
      name: 'Cart',
      component: CartView,
    },
    {
      path: '/checkOut',
      name: 'CheckOut',
      component: CheckOutView,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterView,
    },
    {
      path: '/payment-success',
      name: 'paymentSuccess',
      component: PaymentSuccess,
    },
    {
      path: '/admin',
      component: AdminDashboard,
      meta: { requiresAuth: true, requiresRole: ['admin', 'superadmin'] },
      children: [
        { path: 'foods', name: 'Foods', component: Foods },
        { path: 'orders', name: 'AdOrders', component: AdminOrders },
        { path: 'users', name: 'Users', component: Users },
        { path: 'settings', name: 'AdSettings', component: AdminSettings },
        {
          path: 'order-details/:id',
          name: 'order-details',
          component: OrderDetails,
          props: true,
        },
      ],
    },
    {
      path: '/dashboard',
      component: UserDashboard,
      meta: { requiresAuth: true },
      children: [
        { path: 'orders', name: 'Orders', component: Orders },
        { path: 'settings', name: 'Settings', component: Settings },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  // Try to restore auth from localStorage if store is empty
  if (!auth.user && localStorage.getItem('auth')) {
    auth.loadAuthFromStorage()
  }

  // 1. Check if route requires authentication
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  // 2. Check if route requires a specific role
  if (to.meta.requiresRole) {
    const authRole = auth.user?.role
    if (!to.meta.requiresRole.includes(authRole)) {
      return next({ path: '/' }) // or a 403 Forbidden page
    }
  }

  // 3. Allow navigation
  next()
})

export default router
