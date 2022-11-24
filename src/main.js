import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min'
import Datepicker from 'vue3-datepicker'

const app = createApp(App)
app.component('Datepicker', Datepicker)
app.use(router)
app.mount('#app')
