import { ref } from 'vue'
import api from '@/api/api.js'

export function useFoods() {
  const foods = ref([])
  const loading = ref(false)
  const newFood = ref({ name: '', price: '', description: '', image: null })
  const editingFood = ref(null)

  // Fetch foods from backend
  const fetchFoods = async () => {
    loading.value = true
    try {
      const res = await api.get('/foods')
      foods.value = res.data
    } catch (err) {
      console.error('Failed to fetch foods', err)
    } finally {
      loading.value = false
    }
  }

  // Create food
  const createFood = async () => {
    loading.value = true
    try {
      const formData = new FormData()
      formData.append('name', newFood.value.name)
      formData.append('price', newFood.value.price)
      formData.append('description', newFood.value.description)
      if (newFood.value.image) formData.append('image', newFood.value.image)

      const res = await api.post('/foods', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      foods.value.push(res.data) // update UI
      newFood.value = { name: '', price: '', description: '', image: null } // reset form
      alert('new food created!')
    } catch (err) {
      console.error('Failed to create food', err)
    } finally {
      loading.value = false
    }
  }

  // Update food
  const updateFood = async () => {
    try {
      const formData = new FormData()
      formData.append('name', editingFood.value.name)
      formData.append('price', editingFood.value.price)
      formData.append('description', editingFood.value.description)
      if (editingFood.value.image instanceof File) {
        formData.append('image', editingFood.value.image)
      }

      const res = await api.put(`/foods/${editingFood.value._id}`, formData)
      const index = foods.value.findIndex((f) => f._id === editingFood.value._id)
      foods.value[index] = res.data // update UI
      editingFood.value = null
    } catch (err) {
      console.error('Failed to update food', err)
    }
  }

  // Delete food
  const deleteFood = async (id) => {
    try {
      await api.delete(`/foods/${id}`)
      foods.value = foods.value.filter((f) => f._id !== id) // update UI
    } catch (err) {
      console.error('Failed to delete food', err)
    }
  }

  return {
    fetchFoods,
    createFood,
    updateFood,
    deleteFood,
    foods,
    loading,
    newFood,
    editingFood,
  }
}
