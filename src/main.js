// bootstrap
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'

import {createApp} from 'vue'
import {createPinia} from 'pinia'
import App from './App.vue'
import router from './router'
import {useAuthStore} from "@/services/auth.js";

const pinia = createPinia()
const app = createApp(App)

// Initialize the authentication store
const authStore = useAuthStore(pinia);
authStore.initialize();

app.use(pinia)
app.use(router)

app.mount('#app')
