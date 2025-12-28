import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/menu',
      name: 'Menu',
      component: () => import('@/views/MenuView.vue'),
    },
    {
      path: '/cart',
      name: 'Cart',
      component: () => import('@/views/CartView.vue'),
    },
    {
      path: '/checkOut',
      name: 'CheckOut',
      component: () => import('@/views/CheckOutView.vue'),
      meta: { requiresAuth: true },
    },

    // Auth
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/RegisterView.vue'),
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/components/ForgotPassword.vue'),
      meta: { layout: 'auth' },
    },
    {
      path: '/reset-password/:token',
      name: 'reset-password',
      component: () => import('@/components/ResetPassword.vue'),
      meta: { layout: 'auth' },
    },

    // Payment
    {
      path: '/payment-success',
      name: 'paymentSuccess',
      component: () => import('@/views/paymentSuccess.vue'),
    },

    // Admin
    {
      path: '/admin',
      component: () => import('@/views/AdminDashboard.vue'),
      meta: { requiresAuth: true, requiresRole: ['admin', 'superadmin'] },
      children: [
        { path: 'foods', component: () => import('@/views/admin/Foods.vue') },
        { path: 'orders', component: () => import('@/views/admin/AdminOrders.vue') },
        { path: 'users', component: () => import('@/views/admin/Users.vue') },
        { path: 'settings', component: () => import('@/views/admin/AdminSettings.vue') },
        {
          path: 'order-details/:id',
          component: () => import('@/views/admin/OrderDetails.vue'),
          props: true,
        },
      ],
    },

    // User Dashboard
    {
      path: '/dashboard',
      component: () => import('@/views/UserDashboard.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: 'orders', component: () => import('@/views/Orders.vue') },
        { path: 'settings', name: 'Settings', component: () => import('@/views/Settings.vue') },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  // 1. Restore auth
  if (!auth.user && localStorage.getItem('auth')) {
    auth.loadAuthFromStorage()
  }

  // 2. Redirect logged-in users away from login/register
  if ((to.name === 'Login' || to.name === 'Register') && auth.isLoggedIn) {
    if (auth.user?.role === 'admin' || auth.user?.role === 'superadmin') {
      return next('/admin/foods')
    }
    return next('/dashboard/orders')
  }

  // 3. Requires auth
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  // 4. Must change password
  if (auth.user?.mustChangePassword === true && to.name !== 'Settings') {
    return next({ name: 'Settings', query: { forceChange: true } })
  }

  // 5. Role check
  if (to.meta.requiresRole) {
    if (!to.meta.requiresRole.includes(auth.user?.role)) {
      return next('/')
    }
  }

  next()
})

export default router
