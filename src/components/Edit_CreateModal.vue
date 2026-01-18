<template>
  <div 
    v-if="modelValue" 
    class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    @click.self="cancel"
  >
    <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md space-y-4">
      <h2 class="text-xl font-semibold text-gray-800">
        {{ mode === "create" ? "Create User" : "Edit User" }}
      </h2>

      <form @submit="onSubmit" class="space-y-4">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input 
            v-model="name" 
            type="text"
            placeholder="Enter full name"
            class="border px-3 py-2 rounded w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
            :class="{ 'border-red-500': errors.name }"
          />
          <p v-if="errors.name" class="text-red-500 text-xs mt-1">
            {{ errors.name }}
          </p>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            v-model="email" 
            type="email"
            placeholder="user@example.com"
            class="border px-3 py-2 rounded w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
            :class="{ 'border-red-500': errors.email }"
          />
          <p v-if="errors.email" class="text-red-500 text-xs mt-1">
            {{ errors.email }}
          </p>
        </div>

        <!-- Role -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select 
            v-model="role" 
            class="border px-3 py-2 rounded w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
            :class="{ 'border-red-500': errors.role }"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
          </select>
          <p v-if="errors.role" class="text-red-500 text-xs mt-1">
            {{ errors.role }}
          </p>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-2 mt-6">
          <button 
            type="button"
            @click="cancel" 
            class="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded transition"
          >
            Cancel
          </button>
          <button 
            type="submit"
            :disabled="loading"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {{ loading ? 'Saving...' : (mode === "create" ? "Create" : "Save Changes") }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import api from '@/api/api'
import { useToast } from 'vue-toastification'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'

const toast = useToast()
const loading = ref(false)

const props = defineProps({
  modelValue: Boolean,     // controls visibility
  mode: {                  // "create" | "edit"
    type: String,
    required: true
  },
  user: {                  // null or existing user
    type: Object,
    default: null
  }
})

const emit = defineEmits(["update:modelValue", "saved"])

// Validation schema
const schema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .lowercase()
    .max(100, 'Email cannot exceed 100 characters'),
  
  role: yup
    .string()
    .required('Role is required')
    .oneOf(['user', 'admin', 'superadmin'], 'Invalid role selected')
})

// Setup form with validation
const { handleSubmit, errors, setValues, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    email: '',
    role: 'user'
  }
})

// Register fields
const { value: name } = useField('name')
const { value: email } = useField('email')
const { value: role } = useField('role')

// Watch for user prop changes to populate form in edit mode
watch(
  () => props.user,
  (newUser) => {
    if (props.mode === "edit" && newUser) {
      setValues({
        name: newUser.name || '',
        email: newUser.email || '',
        role: newUser.role || 'user'
      })
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

// Also reset form when modal closes
watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) {
      resetForm()
    }
  }
)

const cancel = () => {
  resetForm()
  emit("update:modelValue", false)
}

// Submit handler with validation
const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true
    let response

    if (props.mode === "create") {
      console.log('Creating user:', values)
      response = await api.post('/api/users', {
        name: values.name.trim(),
        email: values.email.toLowerCase().trim(),
        role: values.role
      })
      toast.success(response.data.message || 'User created successfully')
    } else {
      console.log('Updating user:', props.user._id, values)
      response = await api.put(`/api/users/${props.user._id}`, {
        name: values.name.trim(),
        email: values.email.toLowerCase().trim(),
        role: values.role
      })
      toast.success(response.data.message || 'User updated successfully')
    }

    console.log('Response:', response.data)
    
    // Emit saved event and close modal
    emit("saved")
    emit("update:modelValue", false)
    resetForm()

  } catch (error) {
    console.error('User operation error:', error)
    
    // Handle specific error cases
    if (error.response?.status === 409) {
      toast.error('Email already exists')
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action')
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message)
    } else if (error.code === 'ERR_NETWORK') {
      toast.error('Network error. Please check your connection.')
    } else {
      toast.error('Something went wrong!')
    }
  } finally {
    loading.value = false
  }
})
</script>