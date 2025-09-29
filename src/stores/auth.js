import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.accessToken,
  },
  actions: {
    setAuth(user, token) {
      this.user = user
      this.accessToken = token
    },
    loadAuthFromStorage() {
      const savedAuth = localStorage.getItem('auth')
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth)
        this.user = parsed.user
        this.accessToken = parsed.accessToken
      }
    },
    clearAuth() {
      this.user = null
      this.accessToken = null
      localStorage.removeItem('auth')
    },
  },
})
