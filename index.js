import express from 'express'
import bootstrap from './src/bootstrap.js'
import { config } from 'dotenv'
const app = express()
config()
bootstrap(app, express)
const port = +process.env.PORT


app.listen(port, () => console.log(`Example app listening on port ${port}!`))