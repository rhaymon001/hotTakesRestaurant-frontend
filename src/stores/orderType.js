// stores/order.js
import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orderType: localStorage.getItem('orderType') || 'pickup',
    deliveryDetails: JSON.parse(localStorage.getItem('deliveryDetails')) || {
      name: '',
      phone: '',
      address: '',
      note: '',
    },
  }),
  actions: {
    setOrderType(type) {
      this.orderType = type
      localStorage.setItem('orderType', type)
    },
    setDeliveryDetails(details, mode) {
      if (mode === 'pickup') {
        this.deliveryDetails = { ...details, type: 'pickup' }
      } else if (mode === 'delivery') {
        this.deliveryDetails = { ...details, type: 'delivery' }
      }
    },
  },
})
