<template>
  <header>
    <nav
      class="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md
             border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800"
    >
      <div
        class="max-w-screen-xl mx-auto flex items-center justify-between
               px-4 py-3"
      >
        <!-- Logo -->
        <RouterLink
          :to="{ name: 'Home' }"
          class="flex items-center gap-2 group"
          @click="closeMenu"
        >
          <div
            class="flex items-center justify-center w-9 h-9 rounded-lg
                   bg-green-600 text-white font-bold text-lg
                   transition-transform group-hover:scale-105"
          >
            🔥
          </div>
          <span
            class="text-xl font-bold tracking-wide text-gray-900
                   dark:text-white group-hover:text-green-600 transition-colors"
          >
            Hot<span class="text-green-600">Takes</span>
          </span>
        </RouterLink>

        <!-- Hamburger -->
        <button
          @click="toggleMenu"
          class="md:hidden inline-flex items-center justify-center
                 w-10 h-10 rounded-lg text-gray-500 hover:bg-gray-100
                 dark:text-gray-400 dark:hover:bg-gray-700
                 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        <!-- Desktop Nav -->
        <ul class="hidden md:flex items-center gap-8 text-sm font-medium">
          <NavLink name="Home" />
          <NavLink name="About" />
          <NavLink name="Menu" />
          <OrderTypeButton />
        </ul>

        <!-- Right Actions (Desktop) -->
        <div class="hidden md:flex items-center gap-5">
          <RouterLink
            :to="{ name: 'Cart' }"
            class="relative text-gray-700 dark:text-gray-200
                   hover:text-green-600 transition-colors"
          >
            <font-awesome-icon
              :icon="['fas', 'cart-shopping']"
              class="text-xl"
            />
            <span
              v-if="cartCount > 0"
              class="absolute -top-2 -right-2 bg-green-600 text-white
                     text-xs rounded-full w-5 h-5
                     flex items-center justify-center"
            >
              {{ cartCount }}
            </span>
          </RouterLink>

          <SignInMorphButton />
        </div>
      </div>

      <!-- Mobile Menu -->
      <transition name="slide">
        <div
          v-if="isOpen"
          class="md:hidden bg-white dark:bg-gray-900
                 border-t border-gray-200 dark:border-gray-800"
        >
          <ul class="flex flex-col gap-4 px-4 py-5 text-sm font-medium">
            <NavLink name="Home" @click="closeMenu" />
            <NavLink name="About" @click="closeMenu" />
            <NavLink name="Menu" @click="closeMenu" />
            <OrderTypeButton />
          </ul>
        </div>
      </transition>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

import NavLink from './NavLink.vue'
import OrderTypeButton from './OrderTypeButton.vue'
import SignInMorphButton from './SignInMorphButton.vue'
import { useCart } from '@/composables/useCart'

const { cartCount } = useCart()

const isOpen = ref(false)
const toggleMenu = () => (isOpen.value = !isOpen.value)
const closeMenu = () => (isOpen.value = false)
</script>

<style scoped>
/* Mobile slide animation */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
