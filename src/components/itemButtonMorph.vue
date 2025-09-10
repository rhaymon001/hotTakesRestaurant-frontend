<template>
  <div>
    <!-- Show Add to Cart if quantity is 0 -->
    <button
      v-if="quantity === 0"
      @click="addToCart"
      class="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition"
    >
      Add to Cart
    </button>

    <!-- Show stepper if quantity > 0 -->
    <div v-else class="flex items-center space-x-3">
      <button @click="dec" class="bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full">
        -
      </button>

      <span class="text-lg font-semibold">{{ quantity }}</span>

      <button @click="inc" class="bg-green-500 hover:bg-green-600 text-white w-8 h-8 rounded-full">
        +
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  quantity: { type: Number, default: 0 }, // comes from parent/composable
})

const emit = defineEmits(['updateQuantity', 'add'])

function addToCart() {
  emit('add')
}

function inc() {
  emit('updateQuantity', props.quantity + 1)
}

function dec() {
  const next = props.quantity - 1
  emit('updateQuantity', next < 0 ? 0 : next) // never below 0
}
</script>
