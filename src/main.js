import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import 'vue-toastification/dist/index.css' // Import the default CSS
// Font Awesome core
import { library } from '@fortawesome/fontawesome-svg-core'

// Font Awesome Vue component
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Import only the icons you need
import { faFacebook, faTwitter, faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons'
import { faUser, faHome, faRightToBracket, faCartShopping } from '@fortawesome/free-solid-svg-icons'

// Add icons to the library
library.add(
  faFacebook,
  faUser,
  faHome,
  faTwitter,
  faInstagram,
  faTiktok,
  faRightToBracket,
  faCartShopping,
)

const app = createApp(App)
// Register the <font-awesome-icon> component globally
app.component('font-awesome-icon', FontAwesomeIcon)

app.use(createPinia())
app.use(router)
const options = {
  // You can set your default options here, e.g., position, timeout
  position: 'top-right',
  timeout: 3000,
}

app.use(Toast, options)
app.use(autoAnimatePlugin)
app.mount('#app')
