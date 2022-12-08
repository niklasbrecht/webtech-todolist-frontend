<template>
  <div>
    <b-container>
      <b-input-group-append>
        <b-row sm="auto">
          <label> Titel:</label>
          <b-form-input v-model="fields.title"></b-form-input>

          <label> Description:</label>
          <b-form-input v-model="fields.description"></b-form-input>
        </b-row>

        <b-col sm="auto">
          <label> Date:</label>
          <Datepicker v-model="fields.date"> </Datepicker>
          <b-button variant="success" @click.prevent="createTask">Add Task</b-button>
        </b-col>
      </b-input-group-append>
    </b-container>
  </div>

  <div>
    <b-container>
      <b-table
        :fields="fields"
        :items="tasks"
        :no-border-collapse="noBorderCollapse"
        :striped="striped"
        :bordered="bordered"
        v-model:sort-by="sortBy"
        v-model:sort-desc="sortDesc"
        responsive="sm">

        <template #cell(title)="data">
          {{ data.value }}
        </template>

        <template #cell(description)="data">
          <b class="text-info">{{ data.value }}</b>
        </template>

        <template #cell(date)="data">
          {{ this.reverseDate(data.value) }}
        </template>

        <template #cell(taskId)="data">
          <b-button size="sm" @click="deleteTask(data.value)">Delete</b-button>
        </template>

      </b-table>
    </b-container>
  </div>

</template>

<script>

export default {
  name: 'Tasks',
  data () {
    return {
      sortBy: 'date',
      sortDesc: false,
      noBorderCollapse: true,
      striped: false,
      bordered: true,
      hover: true,
      fixed: true,
      footClone: true,
      filter: null,
      fields: [
        { key: 'title', sortable: true, thStyle: { width: '25%' } },
        { key: 'description', sortable: false, thStyle: { width: '40%' } },
        { key: 'date', sortKey: this.sortBy, sortable: true, thStyle: { width: '15%' } },
        { key: 'taskId', label: 'Actions', sortable: false, thStyle: { width: '20%' } }
      ],
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
        this.addTaskLocal({
          title: task.titel,
          description: task.inhalt,
          date: this.reverseDate(new Date(task.datum).toLocaleDateString()),
          taskId: task.id
        })
      }))
      .catch(error => console.log('error', error))
  },
  methods: {
    async createTask () {
      const endpoint = process.env.VUE_APP_BACKEND_BASE_URL + '/api/v2/tasks'
      const myHeaders = new Headers()
      const date = this.fields.date

      myHeaders.append('Content-Type', 'application/json')
      myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('jsonWebToken'))

      const raw = JSON.stringify({
        datum: date,
        inhalt: this.fields.description,
        titel: this.fields.title
      })

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      }

      await this.fetchResult(endpoint, requestOptions)
    },
    deleteTask (taskId) {
      const endpoint = process.env.VUE_APP_BACKEND_BASE_URL + '/api/v2/tasks/' + taskId
      const myHeaders = new Headers()

      myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('jsonWebToken'))

      const requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
      }

      fetch(endpoint, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error))

      console.log(this.deleteTaskLocal(taskId))
    },
    async fetchResult (endpoint, requestOptions) {
      fetch(endpoint, requestOptions)
        .then(response => response.text())
        .then(async result => {
          this.addTaskLocal({
            title: this.fields.title,
            description: this.fields.description,
            date: this.reverseDate(new Date(this.fields.date).toLocaleDateString()),
            taskId: result
          })
        })
        .catch(error => {
          console.log('error', error)
        })
    },
    reverseDate (date) {
      const splitDate = date.toLocaleString().split('.')
      return (splitDate[2] + '.' + splitDate[1] + '.' + splitDate[0])
    },
    addTaskLocal (task) {
      return this.tasks.push(task)
    },
    deleteTaskLocal (taskId) {
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].taskId === taskId) {
          this.tasks.splice(i, i)
          return true
        }
      }
      return false
    }
  }
}
</script>

<style scoped>

div {
  margin-bottom: 30px;
  margin-top: 25px;
}
</style>
