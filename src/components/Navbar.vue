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
export default {
  name: 'Nav-bar',
  mounted () {
    if (this.loggedIn()) {
      document.getElementById('navbar-login').innerHTML = 'logout'
    } else {
      document.getElementById('navbar-login').innerHTML = 'login'
    }
  },
  methods: {
    onLoginClick () {
      if (this.loggedIn()) {
        // log user out
        localStorage.removeItem('jsonWebToken')
        localStorage.removeItem('email')

        // reload so modal closes and login status changes - bad solution
        document.location.reload()
      } else {
        // open modal
      }
    },
    loggedIn () {
      return localStorage.getItem('jsonWebToken') != null
    }
  }
}

</script>

<style scoped>

</style>
