<script setup>
import { ref, watchEffect } from 'vue'
import { useBusinessStore } from '@/stores/business'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useToast } from 'vue-toastification'

const businessStore = useBusinessStore()
const toast = useToast()
const loading = ref(false)
const success = ref(false)

// Validation schema
const schema = yup.object({
  businessName: yup
    .string()
    .required('Business name is required')
    .min(3, 'Business name must be at least 3 characters')
    .max(100, 'Business name cannot exceed 100 characters'),
  
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description cannot exceed 500 characters'),
  
  address: yup.object({
    street: yup
      .string()
      .required('Street address is required')
      .min(5, 'Street address must be at least 5 characters'),
    city: yup
      .string()
      .required('City is required')
      .min(2, 'City must be at least 2 characters'),
    state: yup
      .string()
      .required('State is required')
      .min(2, 'State must be at least 2 characters')
  }),
  
  contact: yup.object({
    phone: yup
      .string()
      .required('Phone number is required')
      .matches(/^[0-9+\-\s()]{10,20}$/, 'Please enter a valid phone number'),
    email: yup
      .string()
      .required('Email is required')
      .email('Please enter a valid email address')
      .lowercase()
  }),
  
  socialLinks: yup.object({
    facebook: yup
      .string()
      .url('Please enter a valid URL (e.g., https://facebook.com/...)')
      .nullable(),
    instagram: yup
      .string()
      .url('Please enter a valid URL (e.g., https://instagram.com/...)')
      .nullable(),
    twitter: yup
      .string()
      .url('Please enter a valid URL (e.g., https://twitter.com/...)')
      .nullable()
  })
})

// Setup form with validation
const { handleSubmit, errors, setValues } = useForm({
  validationSchema: schema,
  initialValues: {
    businessName: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: ''
    },
    contact: {
      phone: '',
      email: ''
    },
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: ''
    }
  }
})

// Register fields
const { value: businessName } = useField('businessName')
const { value: description } = useField('description')
const { value: street } = useField('address.street')
const { value: city } = useField('address.city')
const { value: state } = useField('address.state')
const { value: phone } = useField('contact.phone')
const { value: email } = useField('contact.email')
const { value: facebook } = useField('socialLinks.facebook')
const { value: instagram } = useField('socialLinks.instagram')
const { value: twitter } = useField('socialLinks.twitter')

// Opening hours (not validated by VeeValidate, handled separately)
const openingHours = ref([])

/**
 * Populate form once business info is loaded
 */
watchEffect(() => {
  if (businessStore.info) {
    const info = businessStore.info
    
    // Set VeeValidate values
    setValues({
      businessName: info.businessName || '',
      description: info.description || '',
      address: {
        street: info.address?.street || '',
        city: info.address?.city || '',
        state: info.address?.state || ''
      },
      contact: {
        phone: info.contact?.phone || '',
        email: info.contact?.email || ''
      },
      socialLinks: {
        facebook: info.socialLinks?.facebook || '',
        instagram: info.socialLinks?.instagram || '',
        twitter: info.socialLinks?.twitter || ''
      }
    })
    
    // Set opening hours separately
    openingHours.value = info.openingHours || []
  }
})

// Submit handler with validation
const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true
    success.value = false

    // Combine validated values with opening hours
    const formData = {
      ...values,
      openingHours: openingHours.value
    }

    await businessStore.updateBusinessInfo(formData)
    
    success.value = true
    toast.success('Business info updated successfully')
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      success.value = false
    }, 3000)

  } catch (err) {
    console.error('Business update error:', err)
    toast.error(err.response?.data?.message || 'Failed to update business info')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="p-6 max-w-4xl">
    <h1 class="text-2xl font-bold mb-6">Business Settings</h1>

    <!-- SUCCESS -->
    <div
      v-if="success"
      class="mb-4 p-3 bg-green-100 text-green-700 rounded border border-green-300"
    >
      Business info updated successfully.
    </div>

    <form @submit="onSubmit">
      <!-- BASIC INFO -->
      <section class="mb-8">
        <h2 class="font-semibold mb-3">Basic Information</h2>

        <div class="space-y-4">
          <div>
            <input
              v-model="businessName"
              type="text"
              placeholder="Business Name"
              class="input"
              :class="{ 'error-border': errors.businessName }"
            />
            <p v-if="errors.businessName" class="error-text">
              {{ errors.businessName }}
            </p>
          </div>

          <div>
            <textarea
              v-model="description"
              placeholder="Short description"
              rows="3"
              class="input"
              :class="{ 'error-border': errors.description }"
            />
            <p v-if="errors.description" class="error-text">
              {{ errors.description }}
            </p>
          </div>
        </div>
      </section>

      <!-- ADDRESS -->
      <section class="mb-8">
        <h2 class="font-semibold mb-3">Address</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              v-model="street"
              type="text"
              placeholder="Street"
              class="input"
              :class="{ 'error-border': errors['address.street'] }"
            />
            <p v-if="errors['address.street']" class="error-text">
              {{ errors['address.street'] }}
            </p>
          </div>

          <div>
            <input
              v-model="city"
              type="text"
              placeholder="City"
              class="input"
              :class="{ 'error-border': errors['address.city'] }"
            />
            <p v-if="errors['address.city']" class="error-text">
              {{ errors['address.city'] }}
            </p>
          </div>

          <div>
            <input
              v-model="state"
              type="text"
              placeholder="State"
              class="input"
              :class="{ 'error-border': errors['address.state'] }"
            />
            <p v-if="errors['address.state']" class="error-text">
              {{ errors['address.state'] }}
            </p>
          </div>
        </div>
      </section>

      <!-- CONTACT -->
      <section class="mb-8">
        <h2 class="font-semibold mb-3">Contact</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              v-model="phone"
              type="text"
              placeholder="Phone number (e.g., +234 801 234 5678)"
              class="input"
              :class="{ 'error-border': errors['contact.phone'] }"
            />
            <p v-if="errors['contact.phone']" class="error-text">
              {{ errors['contact.phone'] }}
            </p>
          </div>

          <div>
            <input
              v-model="email"
              type="email"
              placeholder="Email address"
              class="input"
              :class="{ 'error-border': errors['contact.email'] }"
            />
            <p v-if="errors['contact.email']" class="error-text">
              {{ errors['contact.email'] }}
            </p>
          </div>
        </div>
      </section>

      <!-- OPENING HOURS -->
      <section class="mb-8">
        <h2 class="font-semibold mb-3">Opening Hours</h2>

        <div
          v-for="(day, index) in openingHours"
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
        <h2 class="font-semibold mb-3">Social Links (Optional)</h2>

        <div class="space-y-3">
          <div>
            <input
              v-model="facebook"
              type="url"
              placeholder="Facebook URL (e.g., https://facebook.com/yourpage)"
              class="input"
              :class="{ 'error-border': errors['socialLinks.facebook'] }"
            />
            <p v-if="errors['socialLinks.facebook']" class="error-text">
              {{ errors['socialLinks.facebook'] }}
            </p>
          </div>

          <div>
            <input
              v-model="instagram"
              type="url"
              placeholder="Instagram URL (e.g., https://instagram.com/yourpage)"
              class="input"
              :class="{ 'error-border': errors['socialLinks.instagram'] }"
            />
            <p v-if="errors['socialLinks.instagram']" class="error-text">
              {{ errors['socialLinks.instagram'] }}
            </p>
          </div>

          <div>
            <input
              v-model="twitter"
              type="url"
              placeholder="Twitter/X URL (e.g., https://twitter.com/yourpage)"
              class="input"
              :class="{ 'error-border': errors['socialLinks.twitter'] }"
            />
            <p v-if="errors['socialLinks.twitter']" class="error-text">
              {{ errors['socialLinks.twitter'] }}
            </p>
          </div>
        </div>
      </section>

      <!-- SAVE -->
      <button
        type="submit"
        :disabled="loading"
        class="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {{ loading ? 'Saving...' : 'Save Changes' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.input {
  @apply w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black transition;
}

.input.error-border {
  @apply border-red-500;
}

.error-text {
  @apply text-red-500 text-xs mt-1;
}
</style>