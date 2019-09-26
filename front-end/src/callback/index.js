// config from config.js
var config = appConfig
// vue router
var router = new VueRouter({ mode: 'history' })
// vue app
var app = new Vue({
  router: router,
  data: {
    // url query params:
    query: null,
    // render state for getting token async
    gettingToken: false,
    // render state for getting refresh token async
    gettingRefreshToken: false,
    // render state for getting user info async
    gettingUserInfo: false,
    // data from getting a token from the api service
    tokenData: null,
    // data from getting a refresh token from the api service
    refreshData: null,
    // data from getting userinfo
    userInfoData: null,
    // any errors
    error: null
  },
  computed: {
    // get the 'code' out of the query params
    authCode: function() {
      return this.query && this.query.code
    },
    // the tokenResponse from the response
    tokenResponse: function() {
      return this.tokenData && this.tokenData.tokenResponse
    },
    // the decoded token from the response
    decodedToken: function() {
      return this.tokenData && this.tokenData.decodedToken
    },
    // the access_token from the response
    accessToken: function() {
      return this.tokenResponse && this.tokenResponse.access_token
    },
    // the refresh_token from the response
    refreshToken: function() {
      return this.tokenResponse && this.tokenResponse.refresh_token
    },
    // the id_token from the response = JWT
    idToken: function() {
      return this.tokenResponse && this.tokenResponse.id_token
    },
    // the decoded token payload from the response
    decodedPayload: function() {
      return this.decodedToken && this.decodedToken.payload
    },
    // the tokenResponse from the refreshData response
    refreshDataTokenResponse: function() {
      return this.refreshData && this.refreshData.tokenResponse
    },
    // the access_token from the refreshData response
    refreshDataAccessToken: function() {
      return this.refreshDataTokenResponse && this.refreshDataTokenResponse.access_token
    },
  },
  created: function() {
    // set this.query to the url query params when vue instance is created
    this.query = this.$route.query
  },
  methods: {
    // get a token from the api service and save it in the vue instance as tokenData
    getToken: function() {
      if (!this.authCode) {
        return alert('No code found in query')
      }
      this.gettingToken = true
      const self = this
      // post to the api using axios, sending the code in the body
      axios.post(config.apiTokenEndpoint, { code: this.authCode, redirectUri: config.redirectUri })
      .then(function (response) {
        var data = response.data
        // set the tokenData on the vue instance for rendering
        self.tokenData = data
        self.gettingToken = false
      })
      .catch(function (e) {
        self.gettingToken = false
        self.handleError(e)
      })
    },
    getRefreshToken: function() {
      if (!this.refreshToken) {
        return alert('No refreshToken found in app')
      }
      this.gettingRefreshToken = true
      const self = this
      // post to the api using axios, sending the code in the body
      axios.post(config.apiRefreshEndpoint, { token: this.refreshToken, redirectUri: config.redirectUri })
      .then(function (response) {
        var data = response.data
        self.refreshData = data
        self.gettingRefreshToken = false
      })
      .catch(function (e) {
        self.gettingRefreshToken = false
        self.handleError(e)
      })
    },
    getUserInfo: function() {
      var accessToken = this.refreshDataAccessToken || this.accessToken
      if (!accessToken) {
        return alert('No accessToken found in app')
      }
      this.gettingUserInfo = true
      const self = this
      axios.post(config.apiUserinfoEndpoint, { accessToken: accessToken })
      .then(function(response) {
        var data = response.data
        self.userInfoData = data
        self.gettingUserInfo = false
      })
      .catch(function (e) {
        self.gettingUserInfo = false
        self.handleError(e)
      })
    },
    stringify: function(obj) {
      return obj && JSON.stringify(obj, null, 2)
    },
    handleError(e) {
      const errMessage = (e.response && e.response.data) || e.message || e
      console.error(e, errMessage)
      this.error = errMessage
      alert(this.stringify(errMessage))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}).$mount('#app')
