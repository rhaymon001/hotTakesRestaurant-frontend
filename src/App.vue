<template>
    <NavBar v-if="route.meta.layout !== 'auth'"/>

  <main :class="{'pt-[60px]':route.meta.layout !== 'auth'}">
    <RouterView v-slot="{ Component }">
      <component :is="Component"  />
    </RouterView>
  </main>
 <!-- Mobile Cart UX -->
  <CartButton @open="cartOpen = true" />
  <CartSheet :open="cartOpen" @close="cartOpen = false" />
    <Footer v-if="route.meta.layout !== 'auth'"/>
</template>

<script setup>
import { RouterLink, RouterView,useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import Footer from './components/Footer.vue'
import { onMounted,ref } from 'vue'
import { useBusinessStore } from './stores/business'
import CartButton from './components/CartButton.vue'
import CartSheet from './components/CartSheet.vue'

const route = useRoute()
const businessStore = useBusinessStore()


const cartOpen = ref(false)

onMounted(() => {
  businessStore.fetchBusinessInfo()
})
</script>
