var origin = window.location.origin
var dev = origin === 'http://localhost:3000'
var apiRoot = dev ? 'http://localhost:8080' : origin

var appConfig = {
  clientId: 'YOUR-CLIENT-ID', // for interacting with the NHS Login service
  nhsRootDomain: 'https://auth.sandpit.signin.nhs.uk',
  scope: 'openid profile',
  responseType: 'code',
  redirectUri: origin + '/callback',
  apiTokenEndpoint: apiRoot + '/api/token',
  apiRefreshEndpoint:apiRoot + '/api/refresh',
  apiUserinfoEndpoint: apiRoot + '/api/user-info'
}
