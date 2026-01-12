<script setup>
import DeliveryForm from '@/components/DeliveryForm.vue'
import PickUpForm from '@/components/PickUpForm.vue'
import { useCart } from '@/composables/useCart'
import { useAuthStore } from '@/stores/auth'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/orderType'
import { usePayment } from "@/composables/usePayment"
import { useToast } from 'vue-toastification'

const order = useOrderStore()
const auth = useAuthStore()
const { cart, total } = useCart()
const router = useRouter()
const { initializePayment } = usePayment()
const toast = useToast()

// Template refs - these will hold references to the child form components
const pickupFormRef = ref(null)
const deliveryFormRef = ref(null)

// Loading state for checkout button
const loading = ref(false)

// Calculate delivery fee based on order type
const deliveryFee = computed(() => (order.orderType === 'delivery' ? 500 : 0))

const checkout = async () => {
  console.log('🚀 Checkout initiated')
  
  // Step 1: Check if cart has items
  if (!cart.value.length) {
    toast.error('Your cart is empty. Add items before checkout.')
    return
  }

  // Step 2: Determine which form is currently active
  const activeForm = order.orderType === 'pickup' 
    ? pickupFormRef.value 
    : deliveryFormRef.value
  
  console.log('📋 Active form:', order.orderType, activeForm)
  
  // Step 3: Check if form reference exists
  if (!activeForm) {
    toast.error('Form not found. Please refresh the page.')
    console.error('❌ Form ref is null')
    return
  }

  // Step 4: Check if validate function exists
  if (!activeForm.validate) {
    toast.error('Form validation not available. Please refresh the page.')
    console.error('❌ validate function not exposed from child component')
    return
  }

  loading.value = true

  try {
    // Step 5: Call validate and wait for the result
    console.log('⏳ Calling validate...')
    const validatedValues = await activeForm.validate()
    
    console.log('✅ Validation passed! Values:', validatedValues)

    // Step 6: Prepare order items from cart
    const orderItems = cart.value.map((item) => {
      const { _id, ...rest } = item
      return { 
        foodId: _id,
        ...rest
      }
    })

    // Step 7: Create order payload with validated form data
    const orderPayload = {
      userId: auth.user.id,
      totalAmount: (total.value + deliveryFee.value),
      orderDetails: {
        email: auth.user.email,
        items: orderItems,
        deliveryType: order.orderType,
        deliveryDetails: validatedValues,
      }
    }

    console.log('📦 Order Payload:', orderPayload)
    
    // Step 8: Proceed to payment gateway
    initializePayment(orderPayload)
    
  } catch (errors) {
    // Validation failed
    console.log('❌ Validation failed with errors:', errors)
    
    // Show user-friendly error message
    if (errors && typeof errors === 'object') {
      const errorFields = Object.keys(errors)
      if (errorFields.length > 0) {
        toast.error(`Please fix: ${errorFields.join(', ')}`)
      } else {
        toast.error('Please fill in all required fields correctly')
      }
    } else {
      toast.error('Please complete all required fields')
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-10 px-6">
    <h1 class="text-3xl font-bold text-center text-teal-900 mb-8">
      Checkout ({{ order.orderType.toUpperCase() }})
    </h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Delivery Info Forms -->
      <PickUpForm 
        v-if="order.orderType === 'pickup'" 
        ref="pickupFormRef" 
      />
      <DeliveryForm 
        v-else 
        ref="deliveryFormRef" 
      />
      
      <!-- Order Summary -->
      <div class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
        
        <div v-if="cart.length" class="space-y-4">
          <!-- Cart Items -->
          <div
            v-for="item in cart"
            :key="item.id"
            class="flex justify-between items-center border-b pb-2"
          >
            <div>
              <h3 class="font-medium">{{ item.name }}</h3>
              <p class="text-sm text-gray-500">x {{ item.quantity }}</p>
            </div>
            <span class="font-semibold">₦{{ item.price * item.quantity }}</span>
          </div>
          
          <!-- Delivery Fee (if applicable) -->
          <div 
            v-if="deliveryFee > 0" 
            class="flex justify-between items-center text-gray-600"
          >
            <span>Delivery Fee</span>
            <span>₦{{ deliveryFee }}</span>
          </div>
          
          <!-- Total -->
          <div class="flex justify-between items-center mt-6 pt-4 border-t">
            <h3 class="text-lg font-bold">Total</h3>
            <span class="text-lg font-bold">₦{{ total + deliveryFee }}</span>
          </div>
          
          <!-- Checkout Button -->
          <button
            @click="checkout"
            :disabled="loading"
            class="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg mt-6 transition-colors"
          >
            {{ loading ? 'Processing...' : 'Proceed to Payment' }}
          </button>
        </div>
        
        <!-- Empty Cart State -->
        <div v-else class="text-gray-600 text-center py-10">
          <p class="mb-4">Your cart is empty.</p>
          <router-link 
            to="/menu" 
            class="text-blue-600 hover:underline"
          >
            Browse our menu
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>