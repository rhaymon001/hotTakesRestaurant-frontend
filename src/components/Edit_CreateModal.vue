<template>
        <div v-if="modelValue" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white p-6 rounded shadow-lg w-full max-w-md space-y-4">
        <h2 class="text-xl font-semibold">  {{ mode === "create" ? "Create User" : "Edit User" }}</h2>

        <div>
          <label class="block text-sm">Name</label>
          <input v-model="form.name" class="border px-3 py-2 rounded w-full" />
        </div>

        <div>
          <label class="block text-sm">Email</label>
          <input v-model="form.email" class="border px-3 py-2 rounded w-full" />
        </div>

        <div>
          <label class="block text-sm">Role</label>
          <select v-model="form.role" class="border px-3 py-2 rounded w-full">
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
          </select>
        </div>

        <div class="flex justify-end gap-2 mt-4">
          <button @click="cancel" class="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button @click="handleSubmit" class="px-4 py-2 bg-green-600 text-white rounded">       {{ mode === "create" ? "Create" : "Save Changes" }}</button>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import api from '@/api/api'
import { useToast } from 'vue-toastification'

const toast = useToast()
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
const res = ref([])
const form = ref({
  name: "",
  email: "",
  role: "user"
})

watch(
  () => props.user,
  (newUser) => {
    if (props.mode === "edit" && newUser) {
      form.value = { ...newUser }
    } else {
      form.value = { name: "", email: "", role: "user" }
    }
  },
  { immediate: true }
)


const cancel = () => {
    emit("update:modelValue", false)
}

const handleSubmit = async () => {
  if(form.name || form.email) return alert(" enter all fields")
  try {
   if (props.mode === "create") {
    console.log(form.value)
    res.value =  await api.post("api/users", form.value)
    console.log(res.value.data.user)
  } else {
    res.value = await api.put(`api/users/${props.user._id}`, form.value)
  }
   toast.success(res.value.data.message)
  } catch (error) {
    console.error(error)
    toast.error(error.response.data.message || "something went wrong!")
  }

    emit("saved")
    emit("update:modelValue", false)
}
</script>
