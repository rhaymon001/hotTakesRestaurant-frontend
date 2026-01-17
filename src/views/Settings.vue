<template>
  <div class="settings-page">
    <!-- Header -->
    <div class="header">
      <div class="icon-wrap">
        <Settings class="icon" />
      </div>
      <div>
        <h1>Settings</h1>
        <p>Manage your account preferences</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button 
        class="tab" 
        :class="{ active: activeTab === 'profile' }"
        @click="activeTab = 'profile'">
        <User />
        Profile
      </button>

      <button 
        class="tab" 
        :class="{ active: activeTab === 'password' }"
        @click="activeTab = 'password'">
        <Lock />
        Password
      </button>

      <button class="tab disabled">
        <Image />
        Avatar
      </button>
    </div>

    <!-- Sections -->
    <div v-auto-animate>
      <!-- Profile Section -->
      <div v-if="activeTab === 'profile'" class="card">
        <h3>Profile Information</h3>

        <form @submit="onProfileSubmit">
          <div class="form-row">
            <div class="field">
              <label>Full Name</label>
              <input 
                v-model="fullName" 
                :class="{ 'error-border': profileErrors.fullName }"
              />
              <p v-if="profileErrors.fullName" class="error-text">
                {{ profileErrors.fullName }}
              </p>
            </div>
          </div>

          <div class="field">
            <label>Email Address</label>
            <input 
              v-model="email" 
              type="email"
              :class="{ 'error-border': profileErrors.email }"
            />
            <p v-if="profileErrors.email" class="error-text">
              {{ profileErrors.email }}
            </p>
          </div>

          <button type="submit" class="btn" :disabled="loading">
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </form>
      </div>

      <!-- Password Section -->
      <div v-if="activeTab === 'password'" class="card">
        <h3>Change Password</h3>

        <form @submit="onPasswordSubmit">
          <div class="field">
            <label>Current Password</label>
            <input 
              type="password" 
              v-model="currentPassword"
              :class="{ 'error-border': passwordErrors.currentPassword }"
            />
            <p v-if="passwordErrors.currentPassword" class="error-text">
              {{ passwordErrors.currentPassword }}
            </p>
          </div>

          <div class="field">
            <label>New Password</label>
            <input 
              type="password" 
              v-model="newPassword"
              :class="{ 'error-border': passwordErrors.newPassword }"
            />
            <p v-if="passwordErrors.newPassword" class="error-text">
              {{ passwordErrors.newPassword }}
            </p>
            <!-- Password strength indicator -->
            <div v-if="newPassword" class="password-strength">
              Password strength: 
              <span :class="passwordStrengthClass">{{ passwordStrengthText }}</span>
            </div>
          </div>

          <div class="field">
            <label>Confirm New Password</label>
            <input 
              type="password" 
              v-model="confirmPassword"
              :class="{ 'error-border': passwordErrors.confirmPassword }"
            />
            <p v-if="passwordErrors.confirmPassword" class="error-text">
              {{ passwordErrors.confirmPassword }}
            </p>
          </div>

          <button type="submit" class="btn" :disabled="loading">
            {{ loading ? 'Updating...' : 'Update Password' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/api'
import { Settings, User, Lock, Image } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'

const route = useRoute()
const auth = useAuthStore()
const toast = useToast()
const activeTab = ref(route.query.forceChange ? 'password' : 'profile')
const loading = ref(false)

// ==========================================
// PROFILE FORM VALIDATION
// ==========================================
const profileSchema = yup.object({
  fullName: yup
    .string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .test('no-extra-spaces', 'Name cannot have leading/trailing spaces', (value) => {
      return value === value?.trim()
    }),
  
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .lowercase('Email must be lowercase')
    .max(100, 'Email cannot exceed 100 characters')
})

const { handleSubmit: handleProfileSubmit, errors: profileErrors, resetForm: resetProfileForm } = useForm({
  validationSchema: profileSchema,
  initialValues: {
    fullName: '',
    email: ''
  }
})

const { value: fullName } = useField('fullName')
const { value: email } = useField('email')

// ==========================================
// PASSWORD FORM VALIDATION
// ==========================================
const passwordSchema = yup.object({
  currentPassword: yup
    .string()
    .required('Current password is required')
    .min(6, 'Password must be at least 6 characters'),
  
  newPassword: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password cannot exceed 128 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .test('different-from-current', 'New password must be different from current password', function(value) {
      return value !== this.parent.currentPassword
    }),
  
  confirmPassword: yup
    .string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
})

const { handleSubmit: handlePasswordSubmit, errors: passwordErrors, resetForm: resetPasswordForm } = useForm({
  validationSchema: passwordSchema,
  initialValues: {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
})

const { value: currentPassword } = useField('currentPassword')
const { value: newPassword } = useField('newPassword')
const { value: confirmPassword } = useField('confirmPassword')

// ==========================================
// PASSWORD STRENGTH CALCULATOR
// ==========================================
const passwordStrength = computed(() => {
  if (!newPassword.value) return 0
  
  let strength = 0
  const pwd = newPassword.value
  
  if (pwd.length >= 8) strength += 1
  if (pwd.length >= 12) strength += 1
  if (/[a-z]/.test(pwd)) strength += 1
  if (/[A-Z]/.test(pwd)) strength += 1
  if (/[0-9]/.test(pwd)) strength += 1
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strength += 1
  
  return strength
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength <= 2) return 'Weak'
  if (strength <= 4) return 'Medium'
  return 'Strong'
})

const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value
  if (strength <= 2) return 'strength-weak'
  if (strength <= 4) return 'strength-medium'
  return 'strength-strong'
})

// ==========================================
// PROFILE UPDATE HANDLER
// ==========================================
const onProfileSubmit = handleProfileSubmit(async (values) => {
  try {
    loading.value = true

    const res = await api.patch('/api/settings/me', {
      fullName: values.fullName.trim(),
      email: values.email.toLowerCase().trim(),
    })

    console.log('Profile updated:', res.data.user)
    toast.success('Profile updated successfully')
    
    // Update auth store with new values
    if (auth.user) {
      auth.user.name = values.fullName.trim()
      auth.user.email = values.email.toLowerCase().trim()
      localStorage.setItem('auth', JSON.stringify(auth))
    }

  } catch (err) {
    console.error('Profile update error:', err)
    const errorMessage = err.response?.data?.message || 'Failed to update profile'
    toast.error(errorMessage)
  } finally {
    loading.value = false
  }
})

// ==========================================
// PASSWORD CHANGE HANDLER
// ==========================================
const onPasswordSubmit = handlePasswordSubmit(async (values) => {
  try {
    loading.value = true

    const res = await api.patch('/api/settings/change-password', {
      oldPassword: values.currentPassword,
      newPassword: values.newPassword,
    })

    toast.success('Password updated successfully')
    
    // Reset form
    resetPasswordForm()
    
    // Update mustChangePassword flag
    if (auth.user) {
      auth.user.mustChangePassword = false
      localStorage.setItem('auth', JSON.stringify(auth))
    }

  } catch (err) {
    console.error('Password change error:', err)
    const errorMessage = err.response?.data?.message || 'Failed to update password'
    toast.error(errorMessage)
  } finally {
    loading.value = false
  }
})

// ==========================================
// LOAD USER DATA ON MOUNT
// ==========================================
onMounted(() => {
  if (auth.user) {
    fullName.value = auth.user.name || ''
    email.value = auth.user.email || ''
  }
})
</script>

<style scoped>
.settings-page {
  max-width: 700px;
}

.header {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;
}

.icon-wrap {
  width: 56px;
  height: 56px;
  background: #eef2ff;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  color: #4f46e5;
}

.header h1 {
  margin: 0;
}

.header p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

/* Tabs */
.tabs {
  background: #ffffff;
  padding: 6px;
  border-radius: 16px;
  display: flex;
  gap: 6px;
  margin-bottom: 20px;
  border: 1px solid #e5e7eb;
}

.tab {
  flex: 1;
  background: transparent;
  border: none;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
}

.tab.active {
  background: #eef2ff;
  color: #4f46e5;
  font-weight: 500;
}

.tab.disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

/* Card */
.card {
  background: white;
  border-radius: 18px;
  padding: 24px;
  border: 1px solid #e5e7eb;
}

.card h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #111827;
}

/* Form */
.form-row {
  display: flex;
  gap: 16px;
}

.field {
  flex: 1;
  margin-bottom: 16px;
}

label {
  font-size: 13px;
  margin-bottom: 6px;
  display: block;
  color: #374151;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #6366f1;
}

input.error-border {
  border-color: #ef4444;
}

.error-text {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
  margin-bottom: 0;
}

/* Password Strength */
.password-strength {
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
}

.strength-weak {
  color: #ef4444;
  font-weight: 600;
}

.strength-medium {
  color: #f59e0b;
  font-weight: 600;
}

.strength-strong {
  color: #10b981;
  font-weight: 600;
}

/* Buttons */
.btn {
  margin-top: 10px;
  padding: 12px 20px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn:hover:not(:disabled) {
  background: #4338ca;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
  background: #9ca3af;
}
</style>