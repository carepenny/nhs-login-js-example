// Run this file for dev
// Import the express app
const app = require('./app.js')
// Import the config file
const config = require('./config')
// Listen on the port defined in config.port
const PORT = config.port
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`)
})
