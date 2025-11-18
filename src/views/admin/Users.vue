<template>
  <div class="p-6 space-y-4">
    <h1 class="text-2xl font-bold">Users Management</h1>

    <!-- Search Bar -->
    <div class="flex items-center gap-2">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search users by name or email..."
        class="border px-3 py-2 rounded w-full"
      />
    </div>

    <!-- Users Table -->
    <table class="min-w-full border mt-4">
      <thead>
        <tr class="bg-gray-100 text-left">
          <th class="p-3 border">Name</th>
          <th class="p-3 border">Email</th>
          <th class="p-3 border">Role</th>
          <th class="p-3 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user._id" class="border-b">
          <td class="p-3 border">{{ user.name }}</td>
          <td class="p-3 border">{{ user.email }}</td>
          <td class="p-3 border">{{ user.role }}</td>
          <td class="p-3 border flex gap-2">
            <button
              @click="openEdit(user)"
              class="px-3 py-1 bg-blue-500 text-white rounded"
            >Edit</button>
            <button
              @click="askDeleteUser(user._id)"
              class="px-3 py-1 bg-red-500 text-white rounded"
            >Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white p-6 rounded shadow-lg w-full max-w-md space-y-4">
        <h2 class="text-xl font-semibold">Edit User</h2>

        <div>
          <label class="block text-sm">Name</label>
          <input v-model="editForm.name" class="border px-3 py-2 rounded w-full" />
        </div>

        <div>
          <label class="block text-sm">Email</label>
          <input v-model="editForm.email" class="border px-3 py-2 rounded w-full" />
        </div>

        <div>
          <label class="block text-sm">Role</label>
          <select v-model="editForm.role" class="border px-3 py-2 rounded w-full">
            <option value="user">User</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
          </select>
        </div>

        <div class="flex justify-end gap-2 mt-4">
          <button @click="closeModal" class="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button @click="updateUser" class="px-4 py-2 bg-green-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>

    <ConfirmModal
  v-model="showDeleteModal"
  title="Delete User"
  message="Are you sure you want to delete this user? This action cannot be undone."
  @confirm="deleteUser"
/>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/api'
import { useToast } from 'vue-toastification'
import ConfirmModal from "@/components/ConfirmModal.vue";

const toast =  useToast()
const users = ref([])
const searchQuery = ref('')

const showModal = ref(false)
const editForm = ref({})
const showDeleteModal = ref(false);
const userToDelete = ref(null);

onMounted(async () => {
  await fetchUsers()
})

async function fetchUsers() {
  try {
    const res = await api.get('/api/users')
    users.value = res.data
  } catch (error) {
    console.error(error)
  }
}

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  return users.value.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

function openEdit(user) {
  editForm.value = { ...user }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function updateUser() {
  try {
   const res = await api.put(`/api/users/${editForm.value._id}`, editForm.value)
   toast.success(res.data.message)
    await fetchUsers()
    closeModal()
  } catch (error) {
    console.error(error)
    toast.error(error.response.data.message)
  }
}

const askDeleteUser = (id) => {
  userToDelete.value = id;
  showDeleteModal.value = true;
};

async function deleteUser(id) {
  if (!userToDelete.value) return;
  try {
   const res =  await api.delete(`/api/users/${userToDelete.value}`)
    toast.success(res.data.message)
    await fetchUsers()
  } catch (error) {
    console.error(error)
     toast.error(error.response.data.message)
  }finally{
    userToDelete.value = null
  }
}
</script>

<style scoped>
</style>
