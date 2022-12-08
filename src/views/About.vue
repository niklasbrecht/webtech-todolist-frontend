<template>
  <div>
    <b-table
      :fields="fields"
      :items="tasks"
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
      striped: true,
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
        this.tasks.push({ title: task.titel, description: task.inhalt, date: this.reverseDate(new Date(task.datum).toLocaleDateString()) })
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
    async fetchResult (endpoint, requestOptions) {
      fetch(endpoint, requestOptions)
        .then(response => response.text())
        .then(async result => {
          console.log(result)
          // reload so tasks will be shown
          document.location.reload()
        })
        .catch(error => console.log('error', error))
    },
    reverseDate (date) {
      const splitDate = date.toLocaleString().split('.')
      return (splitDate[2] + '.' + splitDate[1] + '.' + splitDate[0])
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
