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


app.get('/', async (req, res) => {
    res.send("Welcome on API SEDATIF")
})

app.get('/espaces/travaux', async (req, res) => {
    res.header('Content-Type', 'text/csv');
    res.attachment(`espace-en-travaux-${Date.now()}.csv`);
    res.send(sedatif.espacesEnTravaux())
})

app.get('/espaces/ouvert', async (req, res) => {
    res.header('Content-Type', 'text/csv');
    res.attachment(`espace-ouvert-${Date.now()}.csv`);
    res.send(sedatif.espacesOuverts())
})

const port = process.env.PORT || 5225
const server = app.listen(port, () => console.log(`Listening at http://localhost:${port}`))

