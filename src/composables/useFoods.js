import { ref } from 'vue'
import api from '@/api/api.js'
import { useToast } from 'vue-toastification'

export function useFoods() {
  const toast = useToast()
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
      toast.success('new food uploaded succesfully!')
    } catch (err) {
      console.error('Failed to create food', err)
      toast.error('food upload failed!')
    } finally {
      loading.value = false
    }
  }

  // Update food
  const updateFood = async () => {
    loading.value = true
    try {
      const formData = new FormData()
      formData.append('name', editingFood.value.name)
      formData.append('price', editingFood.value.price)
      formData.append('description', editingFood.value.description)
      if (editingFood.value.image) {
        formData.append('image', editingFood.value.image)
      }

      const res = await api.put(`/foods/${editingFood.value._id}`, formData)
      const index = foods.value.findIndex((f) => f._id === editingFood.value._id)
      foods.value[index] = res.data // update UI
      editingFood.value = null
      toast.success('new food uploaded succesfully!')
    } catch (err) {
      console.error('Failed to update food', err)
      toast.error('failed to update food')
    } finally {
      loading.value = false
    }
  }

  // Delete food
  const deleteFood = async (id) => {
    try {
      await api.delete(`/foods/${id}`)
      foods.value = foods.value.filter((f) => f._id !== id) // update UI
      toast.success('food deleted succesfully!')
    } catch (err) {
      console.error('Failed to delete food', err)
      toast.error('food failed to deleted!')
    }
  }

  const handleNewImageFile = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // ✅ Validate type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload an image (JPEG, PNG, or WEBP).')
      e.target.value = '' // clear file input
      return
    }

    // ✅ Validate size (optional)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      alert('File too large! Maximum size is 2MB.')
      e.target.value = '' // clear file input
      return
    }

    // ✅ If valid, assign it to the food object
    newFood.value.image = file
  }

  const handleEditImageFile = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // ✅ Validate type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload an image (JPEG, PNG, or WEBP).')
      e.target.value = '' // clear file input
      return
    }

    // ✅ Validate size (optional)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      alert('File too large! Maximum size is 2MB.')
      e.target.value = '' // clear file input
      return
    }

    // ✅ If valid, assign it to the food object
    editingFood.value.image = file
  }
  return {
    fetchFoods,
    createFood,
    updateFood,
    deleteFood,
    handleNewImageFile,
    handleEditImageFile,
    foods,
    loading,
    newFood,
    toast,
    editingFood,
  }
}
