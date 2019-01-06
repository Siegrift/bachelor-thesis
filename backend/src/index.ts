import express = require('express')
import { config } from 'dotenv'
import bodyParser from 'body-parser'
import logger from 'morgan'
import compression from 'compression'

import router from './router'

// apply .env properties to `process.env`
const configResult = config()
if (configResult.error) {
  throw configResult.error
}

const app: express.Application = express()
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(compression())
app.use('/', router)

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`)
})