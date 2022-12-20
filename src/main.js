import { createApp } from 'vue'
import mitt from 'mitt'
import BootstrapVue3 from 'bootstrap-vue-3'
import App from './App.vue'
import router from './router'
import 'vue-universal-modal/dist/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import 'bootstrap/dist/js/bootstrap.min'
import TableLite from 'vue3-table-lite'
import VueUniversalModal from 'vue-universal-modal'

const emitter = mitt()
const app = createApp(App)
app.use(router)
app.use(BootstrapVue3)
app.use(TableLite)
app.use(VueUniversalModal, {
  teleportTarget: 'body'
})
app.config.globalProperties.emitter = emitter
app.mount('#app')
