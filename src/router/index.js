import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import MenuView from '@/views/MenuView.vue'
import CartView from '@/views/CartView.vue'
import CheckOutView from '@/views/CheckOutView.vue'

// Admin layout + children
import AdminDashboard from '@/views/AdminDashboard.vue'
import Foods from '@/views/admin/Foods.vue'
import Orders from '@/views/admin/Orders.vue'
import Users from '@/views/admin/Users.vue'
import Settings from '@/views/admin/Settings.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'

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
      path: '/admin',
      component: AdminDashboard,
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        { path: 'foods', component: Foods },
        { path: 'orders', component: Orders },
        { path: 'users', component: Users },
        { path: 'settings', component: Settings },
      ],
    },
  ],
})

export default router
