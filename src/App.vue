<template>
  <header>
    <NavBar v-if="route.meta.layout !== 'auth'"/>
  </header>

  <main :class="{'pt-[60px]':route.meta.layout !== 'auth'}">
    <RouterView v-slot="{ Component }">
      <component :is="Component"  />
    </RouterView>
  </main>

  <footer>
    <Footer v-if="route.meta.layout !== 'auth'"/>
  </footer>
</template>

<script setup>
import { RouterLink, RouterView,useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import Footer from './components/Footer.vue'
const route = useRoute()

</script>
