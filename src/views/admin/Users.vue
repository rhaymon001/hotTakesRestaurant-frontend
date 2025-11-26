<template>
  <div class="p-6 space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Users Management</h1>

      <button
        @click="openCreateModal"
        class="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
      >
        + Create User
      </button>
    </div>
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

    <!-- Edit/ create user Modal -->
     <Edit_CreateModal v-model="showUserModal" :mode="modalMode" :user="selectedUser" @saved="fetchUsers"/>

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
import Edit_CreateModal from '@/components/Edit_CreateModal.vue';

const toast =  useToast()
const users = ref([])
const searchQuery = ref('')
const showDeleteModal = ref(false);
const userToDelete = ref(null);
const showUserModal = ref(false)
const modalMode = ref('')
const selectedUser = ref({})

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

const openCreateModal = ()=>{
  selectedUser.value = null
  modalMode.value = "create"
  showUserModal.value = true
}

function openEdit(user) {
  selectedUser.value = { ...user }
  modalMode.value = "edit"
  showUserModal.value = true
}


const askDeleteUser = (id) => {
  userToDelete.value = id;
  showDeleteModal.value = true;
};

async function deleteUser(id) {
  if (!userToDelete.value) return alert("no user to delete!");
  try {
   const res =  await api.delete(`/api/users/${userToDelete.value}`)
    toast.success(res.data.message)
    await fetchUsers()
  } catch (error) {
     toast.error(error.response.data.message || "error deleting user")
  }finally{
    userToDelete.value = null
  }
}
</script>

<style scoped>
</style>
