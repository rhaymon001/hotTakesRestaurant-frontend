<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">🍴 Food Admin Panel</h1>

    <!-- Create Food -->
    <form @submit.prevent="createFood" class="mb-6 flex flex-col gap-2">
      <input v-model="newFood.name" placeholder="Food name" class="border p-2" required />
      <input
        v-model="newFood.price"
        type="number"
        placeholder="Price"
        class="border p-2"
        required
      />
      <textarea
        v-model="newFood.description"
        placeholder="Description"
        class="border p-2"
      ></textarea>
      <input type="file" @change="handleNewImageFile" />
      <button v-if="!loading" type="submit" class="bg-green-600 text-white px-4 py-2 rounded">
        Add Food
      </button>

      <!-- Spinner -->
      <div v-else class="flex items-center justify-center">
        <svg
          class="animate-spin h-5 w-5 text-green-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      </div>
    </form>

    <!-- Food List -->
    <div v-if="loading">Loading foods...</div>
    <div class="table-wrapper overflow-x-auto w-full">
  <table class="min-w-[700px] w-full border-collapse border">
    <thead>
      <tr class="bg-gray-200">
        <th class="border p-2">Image</th>
        <th class="border p-2">Name</th>
        <th class="border p-2">Price</th>
        <th class="border p-2">Description</th>
        <th class="border p-2">Actions</th>
      </tr>
    </thead>

    <tbody>
      <tr v-auto-animate v-for="food in foods" :key="food._id">
        <td class="border p-2">
          <img
            class="w-16 h-16 object-cover rounded-md border"
            :src="food.imageUrl"
            alt="food item"
          />
        </td>

        <td class="border p-2 whitespace-nowrap">
          {{ food.name }}
        </td>

        <td class="border p-2 whitespace-nowrap">
          ${{ food.price }}
        </td>

        <td class="border p-2 min-w-[200px]">
          {{ food.description }}
        </td>

        <td class="border p-2 flex gap-2 whitespace-nowrap">
          <button
            @click="startEdit(food)"
            class="bg-yellow-500 text-white px-2 py-1 rounded"
          >
            Edit
          </button>

          <button
            @click="deleteFood(food._id)"
            class="bg-red-600 text-white px-2 py-1 rounded"
          >
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>


    <!-- Edit Food Modal -->
    <div v-if="editingFood" class="fixed inset-0 flex items-center justify-center bg-black/50">
      <div class="bg-white p-6 rounded w-96">
        <h2 class="text-xl font-bold mb-4">Edit Food</h2>
        <form @submit.prevent="updateFood" class="flex flex-col gap-2">
          <input v-model="editingFood.name" placeholder="Food name" class="border p-2" />
          <input v-model="editingFood.price" type="number" placeholder="Price" class="border p-2" />
          <textarea
            v-model="editingFood.description"
            placeholder="Description"
            class="border p-2"
          ></textarea>
          <input type="file" @change="handleEditImageFile" />
          <div class="flex justify-end gap-2 mt-4">
            <button type="button" @click="editingFood = null" class="bg-gray-400 px-4 py-2 rounded">
              Cancel
            </button>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFoods } from '@/composables/useFoods'
import { onMounted } from 'vue'

const {
  fetchFoods,
  createFood,
  updateFood,
  deleteFood,
  handleNewImageFile,
  handleEditImageFile,
  foods,
  loading,
  newFood,
  editingFood,
} = useFoods()

onMounted(() => {
  fetchFoods()
})

// handle edit mode
const startEdit = (food) => {
  editingFood.value = { ...food } // clone so we don’t directly mutate the array
}
</script>
