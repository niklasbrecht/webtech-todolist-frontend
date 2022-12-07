import { createApp } from 'vue'
import BootstrapVue3 from 'bootstrap-vue-3'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import 'bootstrap/dist/js/bootstrap.min'
import Datepicker from 'vue3-datepicker'
import TableLite from 'vue3-table-lite'

const app = createApp(App)
app.component('Datepicker', Datepicker)
app.use(router)
app.use(BootstrapVue3)
app.use(TableLite)
app.mount('#app')
