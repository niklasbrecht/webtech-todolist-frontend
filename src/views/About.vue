<template>
  <div>
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

      <template #cell(actions)="data">
        <b-button size="sm" @click="deleteTask(data.value)">Delete</b-button>
      </template>

    </b-table>
  </div>
</template>

<script>

import { ref } from 'vue'

export default {
  name: 'About',
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
      fields: [
        { key: 'title', sortable: true, thStyle: { width: '25%' } },
        { key: 'description', sortable: false, thStyle: { width: '40%' } },
        { key: 'date', sortKey: this.sortBy, sortable: true, thStyle: { width: '15%' } },
        { key: 'actions', sortable: false, thStyle: { width: '20%' } }
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
        this.addTaskLocal({ title: task.titel, description: task.inhalt, date: this.reverseDate(new Date(task.datum).toLocaleDateString()), actions: task.id })
      }))
      .catch(error => console.log('error', error))
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
          console.log(result)
        })
        .catch(error => console.log('error', error))
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
        if (this.tasks[i].actions === taskId) {
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
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
