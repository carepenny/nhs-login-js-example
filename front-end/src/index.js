// config from config.js
var config = appConfig
// vue router
var router = new VueRouter({ mode: 'history' })
// vue app
var app = new Vue({
  router: router,
  data: {
    nhsRootDomain: config.nhsRootDomain,
    clientId: config.clientId,
    scope: config.scope,
    responseType: config.responseType,
    redirectUri: config.redirectUri,
    // render state for getAuthCode click event
    loggingIn: false
  },
  methods: {
    // URL-encode params and create a uri
    uriBuilder: function(url, queries) {
      var newUrl = url
      queries = queries || []
      for(var i = 0; i < queries.length; i++) {
        newUrl = newUrl + (i === 0 ? '?' : '&')
        newUrl = newUrl + encodeURIComponent(queries[i].key) + '=' + encodeURIComponent(queries[i].value)
      }
      return newUrl
    },
    // create the href and redirect the window to NHS login
    getAuthCode: function() {
      this.loggingIn = true
      var redirectLink = this.uriBuilder(this.nhsRootDomain + '/authorize', [
        { key: 'client_id', value: this.clientId },
        { key: 'scope', value: this.scope },
        { key: 'response_type', value: this.responseType },
        { key: 'redirect_uri', value: this.redirectUri }
      ])
      window.location.href = redirectLink
    }
  }
}).$mount('#app')
