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
                  <input type="text" id="formTitle" class="form-control">

                  <label class="col-sm-2 col-form-label" for="formTask">Task</label>
                  <input type="text" id="formTask" class="form-control">
                </div>
              </div>

              <div class="col-12">
                <button type="submit" class="btn btn-primary">Save</button>
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
                  <td>{{task.datum}}</td>
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
      tasks: []
    }
  },
  mounted () {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    }

    fetch('http://localhost:8080/api/v1/tasks', requestOptions)
      .then(response => response.json())
      .then(result => result.forEach(task => {
        this.tasks.push(task)
      }))
      .catch(error => console.log('error', error))
  }
}
</script>

<style scoped>

</style>
