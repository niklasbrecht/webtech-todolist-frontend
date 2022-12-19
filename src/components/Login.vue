<template>
  <div class="modal fade" id="LoginModalForm" tabindex="-1" aria-labelledby="ModalFormLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body">
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          <div class="myform bg-dark">
            <h1 class="text-center">Login Form</h1>
            <form>
              <div class="mb-3 mt-4">
                <label for="exampleInputEmail1" class="form-label">Email</label>
                <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="email">
              </div>
              <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">Password</label>
                <input type="password" class="form-control" id="exampleInputPassword1" v-model="password">
              </div>
              <button type="submit" class="btn btn-light mt-3" @click.prevent="requestToken">LOGIN</button>
              <p>Not a member? <a href="">Signup now</a></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import JwtToken from '@/components/JwtToken'

export default {
  name: 'Login',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    mouted () {
      // this.theModal = new Modal(document.getElementById('LoginModalForm'))
    },
    requestToken () {
      console.log(1)
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

      this.fetchResult(endpoint, requestOptions)
    },
    // calls async method so json-web-token waits for result
    async fetchResult (endpoint, requestOptions) {
      fetch(endpoint, requestOptions)
        .then(response => response.text())
        .then(async result => {
          JwtToken.methods.login(result)
          // should close modal here
        })
        .catch(error => console.log('error', error))
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>

.modal-content {
  width: 80%;
  margin: 0 auto;
}
.modal-body {
  padding: 0;
}
.btn-close {
  position: absolute;
  right: 0;
  padding: 1em;
}
h1 {
  font-size: 2.3em;
  font-weight: bold;
}
.myform {
  padding: 2em;
  max-width: 100%;
  color: #fff;
  box-shadow: 0 4px 6px 0 rgba(22, 22, 26, 0.18);
}
@media (max-width: 576px) {
  .myform {
    max-width: 90%;
    margin: 0 auto;
  }
}
.form-control:focus {
  box-shadow: inset 0 -1px 0 #7e7e7e;
}
.form-control {
  background-color: inherit;
  color: #fff;
  padding-left: 0;
  border: 0;
  border-radius: 0;
  border-bottom: 1px solid #fff;
}
.myform .btn {
  width: 100%;
  font-weight: 800;
  background-color: #fff;
  border-radius: 0;
  padding: 0.5em 0;
}
.myform .btn:hover {
  background-color: inherit;
  color: #fff;
  border-color: #fff;
}
p {
  text-align: center;
  padding-top: 2em;
  color: grey;
}
p a {
  color: #e1e1e1;
  text-decoration: none;
}
p a:hover {
  color: #fff;
}

</style>
