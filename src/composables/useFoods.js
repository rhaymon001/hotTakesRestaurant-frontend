import { ref, onMounted } from 'vue'
import food1 from '@/assets/images/food1.jpg'
import food2 from '@/assets/images/food2.jpg'
import food3 from '@/assets/images/food3.jpg'
import food4 from '@/assets/images/res6.avif'

const foods = ref([])

export function useFoods() {
  //   const fetchFoods = async () => {
  //     try {
  //       const res = await fetch('/api/foods') // your backend route
  //       foods.value = await res.json()
  //     } catch (e) {
  //       console.error('Error fetching foods:', e)
  //     }
  //   }

  function fetchFoods() {
    foods.value = [
      {
        id: 1,
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce and mozzarella cheese',
        price: 12.99,
        image: `${food1}`,
        quantity: 0,
      },
      {
        id: 2,
        name: 'Spaghetti Bolognese',
        description: 'Spaghetti topped with rich beef bolognese sauce',
        price: 9.5,
        image: `${food2}`,
        quantity: 0,
      },
      {
        id: 3,
        name: 'Caesar Salad',
        description: 'Romaine lettuce, croutons, and caesar dressing',
        price: 7.25,
        image: `${food3}`,
        quantity: 0,
      },
      {
        id: 4,
        name: 'Grilled Chicken Sandwich',
        description: 'Grilled chicken breast with lettuce and tomato on a toasted bun',
        price: 8.75,
        image: `${food4}`,
        quantity: 0,
      },
      {
        id: 5,
        name: 'Chocolate Milkshake',
        description: 'Creamy chocolate milkshake topped with whipped cream',
        price: 4.5,
        image: `${food1}`,
        quantity: 0,
      },
      {
        id: 6,
        name: 'Beef Burger',
        description: 'Juicy grilled beef patty with cheese, lettuce and tomato',
        price: 10.25,
        image: `${food1}`,
        quantity: 0,
      },
      {
        id: 7,
        name: 'Chicken Alfredo Pasta',
        description: 'Creamy Alfredo pasta topped with grilled chicken',
        price: 11.75,
        image: `${food1}`,
        quantity: 0,
      },
      {
        id: 8,
        name: 'Greek Salad',
        description: 'Fresh cucumber, tomatoes, olives and feta cheese',
        price: 6.9,
        image: `${food1}`,
        quantity: 0,
      },
      {
        id: 9,
        name: 'Tacos (3pcs)',
        description: 'Soft tortilla tacos filled with spiced beef and salsa',
        price: 8.45,
        image: `${food1}`,
        quantity: 0,
      },
      {
        id: 10,
        name: 'Grilled Salmon',
        description: 'Grilled salmon fillet served with vegetables and lemon sauce',
        price: 15.5,
        image: `${food1}`,
        quantity: 0,
      },
    ]
  }
  onMounted(fetchFoods)

  return { foods, fetchFoods }
}
