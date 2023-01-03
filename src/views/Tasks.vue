<template>
  <div>
    <b-container>
      <b-input-group-append>
        <b-row sm="auto">
          <label> Titel:</label>
          <b-form-input v-model="fields.title" :state="inputValidationTitle"></b-form-input>

          <label> Description:</label>
          <b-form-input v-model="fields.description" :state="inputValidationDescription"></b-form-input>
        </b-row>

        <b-col sm="auto">
          <label> Date:</label>
          <b-form-input type="date" v-model="fields.date"> </b-form-input>
          <b-button variant="success" @click.prevent="createTask">Add Task</b-button>
        </b-col>
      </b-input-group-append>

      <label> Filter:</label>
      <b-form-input v-model="filter" v-on:input="filterTasks"></b-form-input>
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
        sort-compare-locale="de"
        responsive="sm">

        <template #cell(title)="data">
          <b-form-input v-if="tasks[getTaskIndexById(data.item.taskId)].isEdit" v-model="tasks[getTaskIndexById(data.item.taskId)].title"> </b-form-input>
          <span v-else>{{data.value}}</span>
        </template>

        <template #cell(description)="data">
          <b-form-input v-if="tasks[getTaskIndexById(data.item.taskId)].isEdit" type="text" v-model="tasks[getTaskIndexById(data.item.taskId)].description"> <b class="text-info"></b></b-form-input>
          <span v-else>{{data.value}}</span>
        </template>

        <template #cell(date)="data">
          <b-form-input v-if="tasks[getTaskIndexById(data.item.taskId)].isEdit" type="date" v-model="tasks[getTaskIndexById(data.item.taskId)].date"></b-form-input>
          <span v-else>{{ new Date(data.value).toLocaleDateString() }}</span>
        </template>

        <template #cell(taskId)="data">
          <b-button size="sm" @click="editRow(data.value)">
            <span v-if="!tasks[getTaskIndexById(data.value)].isEdit">Edit</span>
            <span v-else>Done</span>
          </b-button>
          <b-button size="sm" @click="deleteTask(data.value)">Delete</b-button>
        </template>

      </b-table>
    </b-container>
  </div>

</template>

<script>

import JwtToken from '@/components/JwtToken'

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
      filter: '',
      fields: [
        { key: 'title', sortable: true, thStyle: { width: '25%' } },
        { key: 'description', sortable: false, thStyle: { width: '40%' } },
        { key: 'date', sortKey: this.sortBy, sortable: true, thStyle: { width: '15%' } },
        { key: 'taskId', label: 'Actions', sortable: false, thStyle: { width: '20%' } }
      ],
      tasks: [],
      filteredTasks: []
    }
  },
  mounted () {
    this.emitter.on('loadTasks', () => {
      this.loadAllTask()
    })

    this.emitter.on('emptyTasks', () => {
      this.tasks = []
    })

    this.emitter.emit('loadTasks')
  },
  computed: {
    inputValidationTitle () {
      // input not empty
      if (this.fields.title === undefined) return null
      return this.fields.title.length > 3
    },
    inputValidationDescription () {
      // input not empty
      if (this.fields.description === undefined) return null
      return this.fields.description.length > 3
    },
    inputValidationDate () {
      // input not empty
      return (this.fields.date !== undefined)
    }
  },
  methods: {
    async createTask () {
      if (JwtToken.methods.jsonTokenExpired() || (!this.inputValidationTitle || !this.inputValidationDescription)) return

      const endpoint = process.env.VUE_APP_BACKEND_BASE_URL + '/api/v2/tasks'
      const myHeaders = new Headers()

      myHeaders.append('Content-Type', 'application/json')
      myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('jsonWebToken'))

      if (!this.inputValidationDate) {
        this.fields.date = new Date().getTime()
      }

      const raw = JSON.stringify({
        titel: this.fields.title,
        inhalt: this.fields.description,
        datum: this.fields.date
      })

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      }

      await this.fetchResult(endpoint, requestOptions)
    },
    loadAllTask () {
      if (JwtToken.methods.jsonTokenExpired()) return

      this.tasks = this.tasks.map(task => ({ ...task, isEdit: false, isHidden: false }))

      const backend = process.env.VUE_APP_BACKEND_BASE_URL
      const myHeaders = new Headers()
      myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('jsonWebToken'))

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      }

      // saved date as timestamp so it gets sorted correctly
      fetch(backend + '/api/v2/tasks', requestOptions)
        .then(response => response.json())
        .then(result => result.forEach(task => {
          this.addTaskLocal({
            title: task.titel,
            description: task.inhalt,
            date: new Date(task.datum).getTime(),
            taskId: task.id
          })
        }))
        .catch(error => console.log('error', error))
    },
    deleteTask (taskId) {
      if (JwtToken.methods.jsonTokenExpired()) return

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
    updateTask (taskId) {
      if (JwtToken.methods.jsonTokenExpired()) return

      const endpoint = process.env.VUE_APP_BACKEND_BASE_URL + '/api/v2/tasks/' + taskId
      const myHeaders = new Headers()

      myHeaders.append('Content-Type', 'application/json')
      myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('jsonWebToken'))

      const raw = JSON.stringify({
        titel: this.tasks[this.getTaskIndexById(taskId)].title,
        inhalt: this.tasks[this.getTaskIndexById(taskId)].description,
        datum: this.tasks[this.getTaskIndexById(taskId)].date
      })

      const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      }

      fetch(endpoint, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error))
    },
    async fetchResult (endpoint, requestOptions) {
      fetch(endpoint, requestOptions)
        .then(response => response.text())
        .then(async result => {
          this.addTaskLocal({
            title: this.fields.title,
            description: this.fields.description,
            date: new Date(this.fields.date).getTime(),
            taskId: result
          })
        })
        .catch(error => {
          console.log('error', error)
        })
    },
    getTaskIndexById (taskId) {
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].taskId === taskId) {
          return i
        }
      }
      return null
    },
    editRow (taskId) {
      this.tasks[this.getTaskIndexById(taskId)].isEdit = !this.tasks[this.getTaskIndexById(taskId)].isEdit

      // task gets updated after done button pressed
      if (!this.tasks[this.getTaskIndexById(taskId)].isEdit) {
        this.updateTask(taskId)
      }
    },
    addTaskLocal (task) {
      return this.tasks.push(task)
    },
    deleteTaskLocal (taskId) {
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].taskId === taskId) {
          this.tasks.splice(i, 1)
          return true
        }
      }
      return false
    },
    filterTasks () {
      for (let i = 0; i < this.tasks.length; i++) {
        if ((!this.tasks[i].title.toLowerCase().startsWith(this.filter.toLowerCase()) &&
          !this.tasks[i].description.toLowerCase().startsWith(this.filter.toLowerCase())) &&
          this.filter !== '') {
          this.filteredTasks.push(this.tasks[i])
          this.tasks.splice(i, 1)
          i--
        }
      }

      for (let i = 0; i < this.filteredTasks.length; i++) {
        if (this.filteredTasks[i].title.toLowerCase().startsWith(this.filter.toLowerCase()) ||
          this.filteredTasks[i].description.toLowerCase().startsWith(this.filter.toLowerCase()) ||
          this.filter === '') {
          this.addTaskLocal(this.filteredTasks[i])
          this.filteredTasks.splice(i, 1)
          i--
        }
      }
    }
  }
}
</script>

<style scoped src="../assets/css/style.css">

</style>
