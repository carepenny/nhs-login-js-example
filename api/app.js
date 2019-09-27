const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const querystring = require('query-string')
const createAndSignBearerToken = require('./utils/createAndSignBearerToken')
const validateToken = require('./utils/validateToken')

// Import the config file
const config = require('./config.js')

// start express
const app = express()

// Use cookie-parser to parse cookies if needed
app.use(cookieParser())

// parse application/json
app.use(bodyParser.json())

// use cors and allow everything
app.use(cors())

// Token endpoint for obtaining a JWT using an authorisation code
app.post(config.tokenEndpoint, async (req, res) => {
  try {
    // get the authorisation code from the post body
    const { code, redirectUri } = req.body
    // create a signed bearer token
    const signedBearerToken = createAndSignBearerToken({
      clientId: config.clientId,
      audience: `${config.nhsRootDomain}/token`,
      privateKeyFilePath: config.privateKeyFilePath
    })
    // create the formData to be sent to to the /token nhs-login endpoint
    const formData = {
      code,
      client_id: config.clientId,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
      client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      client_assertion: signedBearerToken
    }
    // Send off the request to to the /token nhs-login endpoint using axios
    // Note that we use querystring.stringify() to simply create the formData headers
    // see https://stackoverflow.com/a/51648484/7415945
    const response = await axios.post(`${config.nhsRootDomain}/token`, querystring.stringify(formData))
    // get the id_token out of the response (this is the JWT)
    const { id_token } = response.data
    // decode the token
    const decodedToken = jwt.decode(id_token, { complete: true })
    // Validate the token
    const isValid = Boolean(validateToken(id_token))
    // send the whole response and the decoded token back to the front-end
    return res.status(200).send({ isValid, tokenResponse: response.data, decodedToken })
  } catch (e) {
    // handle errors
    const errMessage = (e.response && e.response.data) || e.message || e
    console.error('ERR: ', errMessage)
    return res.status(500).send(errMessage)
  }
})

// Token endpoint for refreshing a JWT using a refresh_token
app.post(config.refreshEndpoint, async (req, res) => {
  try {
    // get the authorisation code from the post body
    const { token, redirectUri } = req.body
    // create a signed bearer token
    const signedBearerToken = createAndSignBearerToken({
      clientId: config.clientId,
      audience: `${config.nhsRootDomain}/token`,
      privateKeyFilePath: config.privateKeyFilePath
    })
    // create the formData to be sent to to the /token nhs-login endpoint
    const formData = {
      // the authorization code returned from the authorization endpoint sent with request
      // as either a 'code' or 'refresh_token'
      refresh_token: token,
      client_id: config.clientId,
      redirect_uri: redirectUri,
      grant_type: 'refresh_token',
      client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      client_assertion: signedBearerToken
    }
    // Send off the request to to the /token nhs-login endpoint using axios
    // Note that we use querystring.stringify() to simply create the formData headers
    // see https://stackoverflow.com/a/51648484/7415945
    const response = await axios.post(`${config.nhsRootDomain}/token`, querystring.stringify(formData))
    // get the id_token out of the response (this is the JWT)
    const { access_token } = response.data
    // decode the token
    const decodedToken = jwt.decode(access_token, { complete: true })
    // Validate the token
    const isValid = Boolean(validateToken(access_token))
    // send the whole response and the decoded token back to the front-end
    return res.status(200).send({ isValid, tokenResponse: response.data, decodedToken })
  } catch (e) {
    // handle errors
    const errMessage = (e.response && e.response.data) || e.message || e
    console.error('ERR: ', errMessage)
    return res.status(500).send(errMessage)
  }
})

app.post(config.userinfoEndpoint, async (req, res) => {
  try {
    // get the accessToken code from the post body
    const { accessToken } = req.body
    // Validate the token
    const isValid = Boolean(validateToken(accessToken))
    // Throw if not valid
    if (!isValid) {
      throw new Error('Access Token is invalid')
    } else {
      console.log('Access Token is valid')
    }
    // get the data from the nhs userinfo endpoint
    const { data } = await axios({
      url: config.nhsRootDomain + '/userinfo',
      method: 'get',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    // send the whole response back to the front-end
    return res.status(200).send(data)
  } catch (e) {
    // handle errors
    const errMessage = (e.response && e.response.data) || e.message || e
    console.error('ERR: ', errMessage)
    return res.status(500).send(errMessage)
  }
})

module.exports = app
