// composables/usePayment.js
import { ref } from 'vue'
import api from '@/api/api'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'

export const usePayment = () => {
  const loading = ref(true)
  const success = ref(false)
  const error = ref(null)
  const reference = ref(null)
  const orderStatus = ref('pending')
  const userAuth = useAuthStore()
  const route = useRoute()

  const initializePayment = async (orderData) => {
    try {
      const res = await api.post('/api/payment/initialize', orderData)

      // Redirect to Paystack payment page
      const { authorization_url } = res.data.data
      window.location.href = authorization_url
    } catch (err) {
      console.error('Payment initialization failed:', err)
    }
  }

  // get reference from query string (support multiple param names)
  const getReferenceFromQuery = (ref) => {
    return (
      route.query.reference || new URLSearchParams(window.location.search).get('reference') || ref
    )
  }

  // verify call to backend
  const verify = async () => {
    loading.value = true
    error.value = null
    success.value = false

    const refVal = getReferenceFromQuery()
    reference.value = refVal

    if (!refVal) {
      error.value = 'No payment reference provided.'
      loading.value = false
      return
    }

    try {
      // try GET verify (per your backend: /api/payment/verify?reference=...)
      const url = `/api/payment/verify?reference=${encodeURIComponent(refVal)}`
      const res = await api.get(url)

      // Paystack response structure: res.data.data.status === 'success'
      const status =
        res?.data?.data?.status || res?.data?.status || (res?.data?.success ? 'success' : null)

      if (status === 'success' || status === 'successful') {
        // mark UI success
        success.value = true
        orderStatus.value = 'completed'
      } else {
        // could be pending, failed, or unknown
        error.value = `Payment verification returned status: ${status || 'unknown'}.`
      }
    } catch (err) {
      console.error('verify error', err)
      // try to extract useful message
      error.value =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Verification request failed.'
    } finally {
      loading.value = false
    }
  }
  return {
    initializePayment,
    getReferenceFromQuery,
    verify,
    orderStatus,
    reference,
    loading,
    success,
    error,
  }
}
