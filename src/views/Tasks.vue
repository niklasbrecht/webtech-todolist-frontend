<template>
<section class="vh-100" style="background-color: #eee;">
  <div class="container py-5 h-100">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col col-lg-9 col-xl-7">
        <div class="card rounded-3">
          <div class="card-body p-4">

            <h4 class="text-center my-3 pb-3">To Do List</h4>

            <form class="row row-cols-lg-auto g-4 justify-content-center align-items-center mb-4 pb-2">
              <div class="col-12">
                <div class="input-group">
                  <label class="col-sm-2 col-form-label" for="formTitle">Title</label>
                  <input type="text" id="formTitle" class="form-control" v-model="title">

                  <label class="col-sm-2 col-form-label" for="formDesc">Description</label>
                  <input type="text" id="formDesc" class="form-control" v-model="description">

                  <label class="col-sm-2 col-form-label" for="formDate">Date</label>
                  <Datepicker v-model="date"></Datepicker>
                </div>
              </div>

              <div class="col-12">
                <button type="submit" class="btn btn-primary" @click.prevent="createTask">Save</button>
              </div>
            </form>

            <table class="table mb-4">
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Task</th>
                  <th scope="col">Datum</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="task in tasks" :key="task.id">
                  <td>{{task.titel}}</td>
                  <td>{{task.inhalt}}</td>
                  <td>{{new Date(task.datum).toLocaleDateString()}}</td>
                  <td>
                    <button type="submit" class="btn btn-danger">Delete</button>
                    <button type="submit" class="btn btn-success ms-1">Finished</button>
                  </td>
                </tr>
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </div>
  </div>
</section>
</template>
<script>
import { ref } from 'vue'
export default {
  name: 'Tasks',
  data () {
    return {
      title: '',
      description: '',
      date: null,
      tasks: []
    }
  },
  mounted () {
    const backend = process.env.VUE_APP_BACKEND_BASE_URL
    const myHeaders = new Headers()
    myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('jsonWebToken'))

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    }

    fetch(backend + '/api/v2/tasks', requestOptions)
      .then(response => response.json())
      .then(result => result.forEach(task => {
        this.tasks.push(task)
      }))
      .catch(error => console.log('error', error))
    console.log(backend)
  },
  methods: {
    createTask () {
      const endpoint = process.env.VUE_APP_BACKEND_BASE_URL + '/api/v2/tasks'
      const myHeaders = new Headers()
      const date = ref(new Date()).value
      const dateObject = new Date(date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay())

      myHeaders.append('Content-Type', 'application/json')
      myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('jsonWebToken'))

      const raw = JSON.stringify({

        datum: dateObject,
        inhalt: this.description,
        titel: this.title
      })

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      }

      this.fetchResult(endpoint, requestOptions)
    },
    async fetchResult (endpoint, requestOptions) {
      fetch(endpoint, requestOptions)
        .then(response => response.text())
        .then(async result => {
          console.log(result)
          // reload so tasks will be shown
          document.location.reload()
        })
        .catch(error => console.log('error', error))
    }
  }
}
</script>

<style scoped>

</style>
