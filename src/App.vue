<template>
  <header>
    <NavBar />
  </header>

  <main class="pt-20">
    <RouterView v-slot="{ Component }">
      <component :is="Component"  />
    </RouterView>
  </main>

  <footer>
    <Footer />
  </footer>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import Footer from './components/Footer.vue'



{/* const handleUpdateCart = (itemObj) => {
  // let foundCartItem = cartItems.value.find((i) => i.id === itemObj.id)
  let filteredCartItems = cartItems.value.filter((i) => i.id !== itemObj.id)
  let newCartItems = [...filteredCartItems, itemObj]
  newCartItems.sort((a, b) => a.id - b.id)
  cartItems.value = newCartItems
} */}
</script>
