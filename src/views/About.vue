<template>
  <div>
    <b-table
      :items="items"
      :fields="fields"
      v-model:sort-by="sortBy"
      v-model:sort-desc="sortDesc"
      responsive="sm"
    ></b-table>
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
      noLocalSorting: true,
      filterDate: '',
      fields: [
        { key: 'title', sortable: true },
        { key: 'description', sortable: false },
        { key: 'date', sortKey: this.sortBy, sortable: true },
        { key: 'actions', sortable: false }
      ],
      items: []
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
        this.items.push({ title: task.titel, description: task.inhalt, date: new Date(task.datum).toLocaleDateString() })
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
    }
  }
}
</script>
