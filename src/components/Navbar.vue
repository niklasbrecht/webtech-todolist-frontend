<template>
  <nav class="navbar navbar-expand-lg bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="/tasks">ToDoList</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <router-link class="nav-link" to="/tasks">Tasks</router-link>
          <router-link class="nav-link" to="/about">About</router-link>
        </div>
      </div>
      <ul class="nav navbar-nav navbar-right">
        <li><a href="#" id="navbar-login" @click="onLoginClick"> Login </a></li>
      </ul>
    </div>
  </nav>

  <Modal
    v-model="isShow"
    :close="closeModal"
  >
    <div class="loginModal">
      <b-row sm="auto">
        <label v-if="showRegistration"> Name:</label>
        <b-form-input v-model="name" v-if="showRegistration"></b-form-input>

        <label v-if="showRegistration"> Surname:</label>
        <b-form-input v-model="surname" v-if="showRegistration"></b-form-input>

        <label> Email:</label>
        <b-form-input v-model="email" :state="inputValidationMail"></b-form-input>

        <label> Password:</label>
        <b-form-input type="password" v-model="password" :state="inputValidationPassword"></b-form-input>
      </b-row>
      <button @click.prevent="registerUser" v-if="showRegistration">
        Register
      </button>
      <button @click="requestToken" v-else>
        Login
      </button>
        <b-button variant="link" id="right-panel-link" v-if="showRegistration" @click="toggleRegistration">Login</b-button>
        <b-button variant="link" id="right-panel-link" @click="toggleRegistration" v-else>Register</b-button>
    </div>
  </Modal>
</template>

<script>
import JwtToken from '@/components/JwtToken'

import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Nav-bar',
  data () {
    return {
      name: '',
      surname: '',
      email: '',
      password: '',
      showRegistration: false
    }
  },
  setup () {
    const isShow = ref(false)

    function showModal () {
      isShow.value = true
    }

    function closeModal () {
      isShow.value = false
    }

    return {
      isShow,
      showModal,
      closeModal
    }
  },
  mounted () {
    if (JwtToken.methods.jsonTokenExpired()) JwtToken.methods.logout()
    this.updateLoginStatus()
  },
  computed: {
    inputValidationMail () {
      // email needs to have @ in it
      if (this.email === '') return null
      return this.email.includes('@')
    },
    inputValidationPassword () {
      // Password needs to be atleast 3 characters long
      if (this.password === '') return null
      return this.password.length > 2
    }
  },
  methods: {
    onLoginClick () {
      if (JwtToken.methods.isLoggedIn()) {
        JwtToken.methods.logout()
        this.emitter.emit('emptyTasks')
        this.updateLoginStatus()
      } else {
        // open modal
        this.showModal()
      }
    },
    updateLoginStatus () {
      if (JwtToken.methods.jsonTokenExpired()) {
        document.getElementById('navbar-login').innerHTML = 'login'
      } else {
        document.getElementById('navbar-login').innerHTML = 'logout'
      }
    },
    toggleRegistration () {
      this.showRegistration = !this.showRegistration
    },
    registerUser () {
      if ((!this.inputValidationMail || !this.inputValidationPassword)) return

      const endpoint = process.env.VUE_APP_BACKEND_BASE_URL + '/api/v1/registration'
      const myHeaders = new Headers()

      myHeaders.append('Content-Type', 'application/json')

      const raw = JSON.stringify({
        vorname: this.name,
        nachname: this.surname,
        email: this.email,
        passwort: this.password
      })

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      }

      this.registerUserFetch(endpoint, requestOptions)
    },
    requestToken () {
      if (!this.inputValidationMail || !this.inputValidationPassword) return

      const endpoint = process.env.VUE_APP_BACKEND_BASE_URL + '/api/v2/auth'

      // create a buffer
      const buff = Buffer.from(this.email + ':' + this.password, 'utf-8')

      // decode buffer as Base64
      const base64 = buff.toString('base64')

      const myHeaders = new Headers()

      myHeaders.append('Authorization', 'Basic ' + base64)

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
      }

      this.requestTokenFetch(endpoint, requestOptions)
    },
    // calls async method so json-web-token waits for result
    async requestTokenFetch (endpoint, requestOptions) {
      fetch(endpoint, requestOptions)
        .then(response => response.text())
        .then(async result => {
          JwtToken.methods.login(result)
          this.closeModal()
          this.updateLoginStatus()
          // load tasks
          this.emitter.emit('loadTasks')
        })
        .catch(error => console.log('error', error))
      this.$router.push('/')
    },
    async registerUserFetch (endpoint, requestOptions) {
      fetch(endpoint, requestOptions)
        .then(response => response.text())
        .then(async result => {
          this.requestToken()
        })
        .catch(error => console.log('error', error))
    }
  }
})
</script>

<style scoped src="../assets/css/style.css">

</style>
