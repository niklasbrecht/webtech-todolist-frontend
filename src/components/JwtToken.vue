<script>
export default {
  name: 'JwtToken',
  methods: {
    jwtDecode (t) {
      const token = {}
      token.raw = t
      token.header = JSON.parse(window.atob(t.split('.')[0]))
      token.payload = JSON.parse(window.atob(t.split('.')[1]))
      return (token)
    },
    jsonTokenExpired () {
      const jsonWebToken = localStorage.getItem('jsonWebToken')
      // not logged in or token expired
      return (jsonWebToken === null || this.jwtDecode(jsonWebToken).payload.exp < new Date() / 1000)
    },
    isLoggedIn () {
      return localStorage.getItem('jsonWebToken') != null
    },
    login (jsonWebToken) {
      localStorage.setItem('jsonWebToken', jsonWebToken)
    },
    logout () {
      localStorage.removeItem('jsonWebToken')
    }
  }
}
</script>

<style scoped>

</style>
