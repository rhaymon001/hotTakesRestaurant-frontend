import { ref, watch, onMounted } from 'vue'

const cart = ref([])

export function useCart() {
  // Load from localStorage once
  onMounted(() => {
    const saved = localStorage.getItem('cart')
    if (saved) cart.value = JSON.parse(saved)
  })

  // Persist whenever cart changes
  watch(
    cart,
    (val) => {
      localStorage.setItem('cart', JSON.stringify(val))
    },
    { deep: true },
  )

  // Add new item
  const addItem = (food) => {
    const found = cart.value.find((i) => i.id === food.id)
    if (found) {
      found.quantity++
    } else {
      cart.value.push({ ...food, quantity: 1 })
    }
  }

  // Update quantity
  const updateQuantity = (id, quantity) => {
    const item = cart.value.find((i) => i.id === id)
    if (item) item.quantity = quantity
    if (item && item.quantity <= 0) {
      cart.value = cart.value.filter((i) => i.id !== id)
    }
  }

  return { cart, addItem, updateQuantity }
}
