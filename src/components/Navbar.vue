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
        <li><a href="#" id="navbar-login" data-bs-toggle="modal" data-bs-target="#LoginModalForm" @click="onLoginClick"> Login </a></li>
      </ul>
    </div>
  </nav>
</template>

<script>
import JwtToken from '@/components/JwtToken'

export default {
  name: 'Nav-bar',
  mounted () {
    if (JwtToken.methods.jsonTokenExpired()) JwtToken.methods.logout()
    this.updateLoginStatus()
  },
  methods: {
    onLoginClick () {
      if (JwtToken.methods.isLoggedIn()) {
        JwtToken.methods.logout()
        // should close modal here
      } else {
        // open modal
      }
    },
    updateLoginStatus () {
      if (JwtToken.methods.jsonTokenExpired()) {
        document.getElementById('navbar-login').innerHTML = 'login'
      } else {
        document.getElementById('navbar-login').innerHTML = 'logout'
      }
    }
  }
}

</script>

<style scoped>

</style>
