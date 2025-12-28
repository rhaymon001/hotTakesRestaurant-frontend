<script setup>
import { ref, watchEffect } from 'vue'
import { useBusinessStore } from '@/stores/business'

const businessStore = useBusinessStore()

/**
 * Local editable copy (important)
 * We never bind form inputs directly to the Pinia state
 */
const form = ref({
  businessName: '',
  description: '',
  address: {
    street: '',
    city: '',
    state: '',
  },
  contact: {
    phone: '',
    email: '',
  },
  openingHours: [],
  socialLinks: {
    facebook: '',
    instagram: '',
    twitter: '',
  },
})

const loading = ref(false)
const success = ref(false)

/**
 * Populate form once business info is loaded
 */
watchEffect(() => {
  if (businessStore.info) {
    form.value = JSON.parse(JSON.stringify(businessStore.info))
  }
})

const saveSettings = async () => {
  try {
    loading.value = true
    success.value = false
    await businessStore.updateBusinessInfo(form.value)
    success.value = true
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="p-6 max-w-4xl">
    <h1 class="text-2xl font-bold mb-6">Business Settings</h1>

    <!-- SUCCESS -->
    <div
      v-if="success"
      class="mb-4 p-3 bg-green-100 text-green-700 rounded"
    >
      Business info updated successfully.
    </div>

    <!-- BASIC INFO -->
    <section class="mb-8">
      <h2 class="font-semibold mb-3">Basic Information</h2>

      <div class="space-y-4">
        <input
          v-model="form.businessName"
          type="text"
          placeholder="Business Name"
          class="input"
        />

        <textarea
          v-model="form.description"
          placeholder="Short description"
          rows="3"
          class="input"
        />
      </div>
    </section>

    <!-- ADDRESS -->
    <section class="mb-8">
      <h2 class="font-semibold mb-3">Address</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          v-model="form.address.street"
          type="text"
          placeholder="Street"
          class="input"
        />
        <input
          v-model="form.address.city"
          type="text"
          placeholder="City"
          class="input"
        />
        <input
          v-model="form.address.state"
          type="text"
          placeholder="State"
          class="input"
        />
      </div>
    </section>

    <!-- CONTACT -->
    <section class="mb-8">
      <h2 class="font-semibold mb-3">Contact</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          v-model="form.contact.phone"
          type="text"
          placeholder="Phone number"
          class="input"
        />
        <input
          v-model="form.contact.email"
          type="email"
          placeholder="Email address"
          class="input"
        />
      </div>
    </section>

    <!-- OPENING HOURS -->
    <section class="mb-8">
      <h2 class="font-semibold mb-3">Opening Hours</h2>

      <div
        v-for="(day, index) in form.openingHours"
        :key="index"
        class="flex items-center gap-3 mb-2"
      >
        <span class="w-24 font-medium">{{ day.day }}</span>

        <input
          v-if="!day.closed"
          v-model="day.open"
          type="time"
          class="input w-28"
        />
        <input
          v-if="!day.closed"
          v-model="day.close"
          type="time"
          class="input w-28"
        />

        <label class="flex items-center gap-1 text-sm">
          <input v-model="day.closed" type="checkbox" />
          Closed
        </label>
      </div>
    </section>

    <!-- SOCIAL LINKS -->
    <section class="mb-8">
      <h2 class="font-semibold mb-3">Social Links</h2>

      <div class="space-y-3">
        <input
          v-model="form.socialLinks.facebook"
          type="url"
          placeholder="Facebook URL"
          class="input"
        />
        <input
          v-model="form.socialLinks.instagram"
          type="url"
          placeholder="Instagram URL"
          class="input"
        />
        <input
          v-model="form.socialLinks.twitter"
          type="url"
          placeholder="Twitter/X URL"
          class="input"
        />
      </div>
    </section>

    <!-- SAVE -->
    <button
      @click="saveSettings"
      :disabled="loading"
      class="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
    >
      {{ loading ? 'Saving...' : 'Save Changes' }}
    </button>
  </div>
</template>

<style scoped>
.input {
  @apply w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black;
}
</style>
