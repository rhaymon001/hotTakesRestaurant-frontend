<script setup>
import { ref } from 'vue'
import api from '@/api/api'

const activeTab = ref('business')

const loading = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

// business info
const businessName = ref('')
const openingTime = ref('')
const closingTime = ref('')
const logo = ref(null)

// handle logo upload
const handleLogoChange = (e) => {
  logo.value = e.target.files[0]
}

// save business info
const saveBusinessInfo = async () => {
  try {
    loading.value = true
    successMsg.value = ''
    errorMsg.value = ''

    const formData = new FormData()
    formData.append('businessName', businessName.value)
    formData.append('openingTime', openingTime.value)
    formData.append('closingTime', closingTime.value)
    if (logo.value) formData.append('logo', logo.value)

    await api.patch('/api/admin/settings/business', formData)

    successMsg.value = 'Business info updated!'
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Update failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">

    <h2 class="text-2xl font-semibold mb-6 text-gray-800">
      Admin Settings
    </h2>

    <!-- Tabs -->
    <div class="flex gap-4 mb-8 border-b">
      <button
        @click="activeTab = 'business'"
        :class="activeTab === 'business' ? 'tab-active' : 'tab'"
      >
        Business Info
      </button>

      <button
        @click="activeTab = 'appearance'"
        :class="activeTab === 'appearance' ? 'tab-active' : 'tab'"
      >
        Branding
      </button>
    </div>

    <!-- TAB: Business Info -->
    <div v-if="activeTab === 'business'" class="space-y-4 max-w-lg">

      <div>
        <label>Business Name</label>
        <input v-model="businessName" class="input" />
      </div>

      <div>
        <label>Opening Time</label>
        <input type="time" v-model="openingTime" class="input" />
      </div>

      <div>
        <label>Closing Time</label>
        <input type="time" v-model="closingTime" class="input" />
      </div>

      <button
        @click="saveBusinessInfo"
        :disabled="loading"
        class="btn-primary"
      >
        {{ loading ? 'Saving...' : 'Save Changes' }}
      </button>

    </div>

    <!-- TAB: Branding -->
    <div v-if="activeTab === 'appearance'" class="space-y-4 max-w-lg">

      <div>
        <label>Upload Logo</label>
        <input type="file" @change="handleLogoChange" />
      </div>

    </div>

    <!-- messages -->
    <p v-if="successMsg" class="msg-success">{{ successMsg }}</p>
    <p v-if="errorMsg" class="msg-error">{{ errorMsg }}</p>

  </div>
</template>

<style scoped>
.tab {
  @apply pb-2 px-2 text-gray-500 hover:text-gray-800;
}

.tab-active {
  @apply pb-2 px-2 text-blue-600 border-b-2 border-blue-600;
}

.input {
  @apply w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400;
}

.btn-primary {
  @apply bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50;
}

.msg-success {
  @apply mt-4 text-green-600;
}

.msg-error {
  @apply mt-4 text-red-600;
}
</style>
