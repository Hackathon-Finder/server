

if (process.env.NODE_ENV) require('dotenv').config()

//connect database
require('./config/mongoose')

const express = require('express')
const cors = require('cors')
const routes = require('./routes')
// const errorHandler = require('./middlewares/errorHandler')
const PORT = process.env.NODE_ENV === 'testing' ? 4000 : process.env.PORT
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', routes)

// app.use(errorHandler)

app.listen(PORT, () => {
  console.log('listening port ', PORT)
})

module.exports = app