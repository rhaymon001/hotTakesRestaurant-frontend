// composables/usePayment.js
import axios from 'axios'

export const usePayment = () => {
  const initializePayment = async (orderData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/payment/initialize', orderData)

      // Redirect to Paystack payment page
      const { authorization_url } = res.data.data
      window.location.href = authorization_url
    } catch (err) {
      console.error('Payment initialization failed:', err)
    }
  }

  return { initializePayment }
}
