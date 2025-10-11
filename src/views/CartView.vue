<template>
  <div class="min-h-screen relative bg-gray-50">
    <!-- ✅ Background for contrast -->

    <!-- 🛒 CART ITEMS TABLE -->
    <div class="relative overflow-x-auto px-6 sm:px-10 pt-20">
      <table class="w-full text-sm text-left text-gray-600">
        <thead class="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" class="px-6 py-3">Item</th>
            <th scope="col" class="px-6 py-3">Title</th>
            <th scope="col" class="px-6 py-3">Price</th>
            <th scope="col" class="px-6 py-3">Quantity</th>
            <th scope="col" class="px-6 py-3">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in cart"
            :key="item.id"
            class="odd:bg-white even:bg-gray-50 border-b border-gray-200 hover:bg-gray-100"
          >
            <td class="px-6 py-4">
              <img
                class="w-16 h-16 object-cover rounded-md border"
                :src="item.imageUrl"
                alt="cart item"
              />
            </td>

            <td class="px-6 py-4 font-medium text-gray-900">{{ item.name }}</td>

            <td class="px-6 py-4">₦{{ item.price }}</td>

            <td class="px-6 py-4">x {{ item.quantity }}</td>

            <td className="TOTAL" class="px-6 py-4 font-semibold text-gray-900">
              ₦{{ item.price * item.quantity }}
            </td>
            <!-- ✅ Bold total -->
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 📊 CART TOTALS TABLE -->
    <div class="relative overflow-x-auto px-6 sm:px-10 pt-10 w-full sm:w-[60%] mb-3">
      <!-- 🔄 Full width on mobile -->
      <table class="w-full text-sm text-left text-gray-600 border rounded-lg shadow-sm">
        <!-- ✅ Added border/shadow -->
        <tbody>
          <!-- Title -->
          <tr class="bg-gray-100 border-b">
            <td colspan="4" class="py-3 px-4 font-bold text-gray-900">Cart Totals</td>
            <!-- ✅ Centered title row -->
          </tr>

          <!-- SubTotal -->
          <tr class="bg-white border-b">
            <th scope="row" class="py-4 px-4 font-medium text-gray-900">SUBTOTAL</th>
            <td></td>
            <td></td>
            <td class="px-4 font-semibold text-gray-900">₦{{ subTotal }}</td>
          </tr>

          <!-- Delivery -->
          <tr class="bg-white border-b">
            <th scope="row" class="py-4 px-4 font-medium text-gray-900">Delivery Fee</th>
            <td></td>
            <td></td>
            <td class="px-4 font-semibold text-gray-900">₦{{ deliveryFee }}</td>
            <!-- ✅ Gave realistic value -->
          </tr>

          <!-- Grand Total -->
          <tr class="bg-gray-50 border-b">
            <th scope="row" class="py-4 px-4 font-bold text-gray-900">Total</th>
            <td></td>
            <td></td>
            <td class="px-4 font-bold text-blue-700 text-lg">₦{{ subTotal + deliveryFee }}</td>
          </tr>
        </tbody>
      </table>

      <!-- ✅ Checkout Button -->
      <div class="mt-5 flex justify-end">
        <RouterLink
          :to="{ name: 'CheckOut' }"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 transition"
        >
          Proceed to Checkout
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { computed, ref } from 'vue'
import { useCart } from '@/composables/useCart'
import { useOrderStore } from '@/stores/orderType'

const { cart } = useCart()
const order = useOrderStore()

const subTotal = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
)
const deliveryFee = computed(() => (order.orderType === 'delivery' ? 500 : 0))
</script>
