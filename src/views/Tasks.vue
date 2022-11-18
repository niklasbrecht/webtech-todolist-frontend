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
                  <input type="text" id="formDate" class="form-control" v-model="date">
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
export default {
  name: 'Tasks',
  data () {
    return {
      title: '',
      description: '',
      date: '',
      userID: 35,
      tasks: []
    }
  },
  methods: {
    createTask () {
      const endpoint = process.env.VUE_APP_BACKEND_BASE_URL + '/api/v1/tasks'
      const myHeaders = new Headers()
      // TODO: Implement Datepicker in HTML
      const dateString = this.date
      const dateParts = dateString.split('.')
      const dateObj = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
      myHeaders.append('Content-Type', 'application/json')

      const raw = JSON.stringify({
        datum: dateObj,
        inhalt: this.description,
        titel: this.title,
        // TODO: Connect to User-Login to get the corresponding UserID when logged in
        benutzer_id: this.userID
      })

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      }

      fetch(endpoint, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error))
    }
  },
  mounted () {
    const backend = process.env.VUE_APP_BACKEND_BASE_URL
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    }

    fetch(backend + '/api/v1/tasks', requestOptions)
      .then(response => response.json())
      .then(result => result.forEach(task => {
        this.tasks.push(task)
      }))
      .catch(error => console.log('error', error))
    console.log(backend)
  }
}
</script>

<style scoped>

</style>
