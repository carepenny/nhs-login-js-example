const jwksClient = require('jwks-rsa')

const jwksClientWrapper = options => {
  // create a new client
  const client = jwksClient(options)
  // Update the getKeys function on the client
  client.getKeys = cb => {
    // Get the keys from an original getKeys function
    jwksClient(options).getKeys((err, keys) => {
      // return the error to the callback if there is one, else
      // return the keys with a 'use' key value pair
      return err ? cb(err) : cb(err, keys.map(x => ({ ...x, use: 'sig' })))
    })
  }
  // create a new client where we'll promisify the getSigningKey function
  const newClient = {
    // spread in the original client with the edited getKeys function
    ...client,
    // create a new promisified getSigningKey function
    getSigningKey(kid) {
      return new Promise((resolve, reject) => {
        client.getSigningKey(kid, (err, key) => {
          return err ? reject(err) : resolve(key)
        })
      })
    }
  }
  return newClient
}

module.exports = jwksClientWrapper
