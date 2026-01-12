<template>
  <nav>
    <RouterLink
      v-if="!auth.isLoggedIn"
      :to="{ name: routeName }"
      class="text-white bg-green-500 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
    >
      {{ route.name=="Register"? "Sign In": "Sign Up"}}
    </RouterLink>

    <RouterLink
      v-else
      to="/dashboard"
      class="text-white bg-green-500 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
    >
      Dashboard
    </RouterLink>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const auth = useAuthStore()
const route = useRoute()


const routeName = computed(() => route.name === "Register" ?  "Login" : "Register")
console.log(routeName.value)
</script>
