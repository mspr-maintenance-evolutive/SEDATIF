require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const sedatif = require('./src/sedatif')

const app = express()

app.enable('trust proxy')
app.use(express.json())
app.use(morgan('common'))
app.use(cors('*'))


app.get('/', async (req, res) => res.send(sedatif.sedatif()))

const port = process.env.PORT || 5225
const server = app.listen(port, () => console.log(`Listening at http://localhost:${port}`))

