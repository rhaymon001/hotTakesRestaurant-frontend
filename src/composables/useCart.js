import { ref, watch, onMounted, computed } from 'vue'

import { useAuthStore } from '@/stores/auth'

const cart = ref([])

export function useCart() {
  const auth = useAuthStore()
  const userId = computed(() => auth.user?.id)

  // Load on mount

  onMounted(() => {
    if (userId.value) {
      const saved = localStorage.getItem(`cart_${userId.value}`)

      if (saved) cart.value = JSON.parse(saved)
    }
  })

  // Persist whenever cart or user changes

  watch(
    [cart, userId],

    ([val, id]) => {
      if (id) {
        localStorage.setItem(`cart_${id}`, JSON.stringify(val))
      }
    },

    { deep: true },
  )

  // Add new item
  const addItem = (food) => {
    const found = cart.value.find((i) => i._id === food._id)
    if (found) {
      found.quantity++
    } else {
      cart.value.push({ ...food, quantity: 1 })
    }
  }

  // Update quantity
  const updateQuantity = (id, quantity) => {
    const item = cart.value.find((i) => i._id === id)
    if (item) item.quantity = quantity
    if (item && item.quantity <= 0) {
      cart.value = cart.value.filter((i) => i._id !== id)
    }
  }

  return { cart, addItem, updateQuantity }
}
