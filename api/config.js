module.exports = {
  port: 8080, // for this api service
  clientId: 'YOUR-CLIENT-ID', // for interacting with the NHS Login service
  tokenEndpoint: '/api/token', // for this api service
  refreshEndpoint: '/api/refresh', // for this api service
  userinfoEndpoint: '/api/user-info', // for this api service
  nhsRootDomain: 'https://auth.sandpit.signin.nhs.uk',
  privateKeyFilePath: 'private_key.pem'
}
