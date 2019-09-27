const jwksClient = require('./custom-jwks-rsa')
const jwt = require('jsonwebtoken')
// Validate a token, returning the decoded token
const validateToken = async (token, jwksUri) => {
  if (!token) return false // not valid obvs
  jwksUri = jwksUri || 'https://auth.sandpit.signin.nhs.uk/.well-known/jwks.json'
  // create a new validation client
  const validationClient = jwksClient({
    strictSsl: true,
    jwksUri
  })
  // decode the token
  const decodedToken = jwt.decode(token, { complete: true })
  if (!decodedToken) return false
  const { kid } = decodedToken.header
  if (!kid) return false
  try {
    const signingKeyResponse = await validationClient.getSigningKey(kid) // will throw if err
    const signingKey = signingKeyResponse.publicKey || signingKeyResponse.rsaPublicKey
    return jwt.verify(token, signingKey)
  } catch (e) {
    console.error(e)
    return false
  }
}
module.exports = validateToken
