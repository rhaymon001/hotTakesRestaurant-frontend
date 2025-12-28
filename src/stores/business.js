import { defineStore } from 'pinia'
import api from '@/api/api' // your configured axios instance
import axios from 'axios'

export const useBusinessStore = defineStore('business', {
  state: () => ({
    info: null,
    loading: false,
    error: null,
  }),

  getters: {
    name: (state) => state.info?.businessName || 'Our Restaurant',
    address: (state) => state.info?.address,
    contact: (state) => state.info?.contact,
    openingHours: (state) => state.info?.openingHours || [],
    socials: (state) => state.info?.socialLinks || {},
  },

  actions: {
    async fetchBusinessInfo() {
      if (this.info) return // prevent refetch everywhere

      try {
        this.loading = true
        const res = await api.get('/api/business-info')
        this.info = res.data
      } catch (err) {
        this.error = 'Failed to load business info'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async updateBusinessInfo(payload) {
      const res = await api.patch('/api/business-info', payload)
      this.info = res.data.info
    },
  },
})
