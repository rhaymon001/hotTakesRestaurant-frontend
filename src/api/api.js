// src/api/api.js
import axios from 'axios'
import { useAuthStore } from '@/stores/auth' // Pinia store

const BASE_URL = import.meta.env.BACKEND_URL || 'http://localhost:5000'

// Create an axios instance for your API calls.
// withCredentials:true => browser will send httpOnly cookies (refresh token) with requests where applicable.
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

// Attach access token to every outgoing request (if present)
api.interceptors.request.use(
  (config) => {
    try {
      const auth = useAuthStore() // get the Pinia auth store at runtime
      // accessToken is stored in the auth store (or load from localStorage fallback)
      const token =
        auth.accessToken ||
        (() => {
          const saved = localStorage.getItem('auth')
          return saved ? JSON.parse(saved).accessToken : null
        })()

      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (e) {
      // If Pinia not ready or any error, just continue without token
      console.warn('Could not attach token to request:', e)
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor: if we get 401 (expired/invalid token), try refresh once and retry original request
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If there's no response or it's not 401, just bubble the error up.
    if (!error.response) return Promise.reject(error)

    const status = error.response.status

    // Only attempt refresh on 401 (Unauthorized). Avoid infinite loops with _retry flag.
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true // mark retry to prevent loops

      try {
        // Call refresh endpoint using the global axios (so it doesn't hit this same interceptor)
        // withCredentials:true so the browser sends the httpOnly refresh cookie
        const refreshResp = await axios.get(`${BASE_URL}/refresh`, { withCredentials: true })

        const newAccessToken = refreshResp.data?.accessToken
        if (!newAccessToken) throw new Error('No access token returned from refresh')

        // Update Pinia store and localStorage so future requests use the fresh token
        try {
          const auth = useAuthStore()
          // Keep existing user info if store already has it, else read from localStorage
          const saved = localStorage.getItem('auth')
          const savedUser = saved ? JSON.parse(saved).user : auth.user || null

          auth.setAuth(savedUser, newAccessToken)

          if (saved) {
            const parsed = JSON.parse(saved)
            parsed.accessToken = newAccessToken
            localStorage.setItem('auth', JSON.stringify(parsed))
          }
        } catch (e) {
          console.warn('Failed to persist refreshed token to store/localStorage:', e)
        }

        // attach new token and retry the original request
        originalRequest.headers = originalRequest.headers || {}
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed (refresh token expired or invalid). Force logout and redirect to login.
        try {
          const auth = useAuthStore()
          auth.clearAuth()
        } catch (e) {
          console.warn('Failed to clear auth store:', e)
        }
        // navigate to login (client-side redirect)
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // For other statuses or if already retried, reject
    return Promise.reject(error)
  },
)

export default api
