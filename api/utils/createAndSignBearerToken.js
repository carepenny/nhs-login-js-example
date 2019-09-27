const jwt = require('jsonwebtoken')
const uuid = require('uuidv4').default
const fs = require('fs')

const createAndSignBearerToken = ({ clientId, audience, privateKeyFilePath, privateKey }) => {
  if (!privateKey && !privateKeyFilePath) {
    throw new Error('No privateKey or privateKeyFilePath passed to createAndSignBearerToken')
  }
  // Read the private key
  privateKey = privateKey || fs.readFileSync(privateKeyFilePath)
  // Set the payload for the bearer-token to be sent to the /token nhs-login endpoint
  // note that the 'exp' key is ommitted here in favour of 'expiresIn' in jwt.sign() below
  const tokenPayload = {
    sub: clientId,
    iss: clientId,
    aud: audience,
    jti: uuid() // new unique id
  }
  // return the signed token
  return jwt.sign(tokenPayload, privateKey, { algorithm: 'RS512', expiresIn: 60 })
}

module.exports = createAndSignBearerToken
