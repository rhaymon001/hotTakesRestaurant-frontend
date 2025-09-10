import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

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

app.mount('#app')
