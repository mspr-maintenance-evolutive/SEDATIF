require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const convert = require('xml-js')
const moment = require('moment')
const fs = require('fs')
//moment('16-02-1986','DD-MM-YYYY')

const app = express()

app.enable('trust proxy')
app.use(express.json())
app.use(morgan('common'))
app.use(cors('*'))

const get_inWork_works = taches => taches.filter(e=>e.Etat._text=='En cours')
const convert_tache_as_array = taches => Array.isArray(taches)?taches:[taches]

const get_task_inWork_with_latest_DateEnd = jsonify_xml => {
  let tache_as_array = convert_tache_as_array(jsonify_xml.Document.Chantier.Tache)
  let inWork_works = get_inWork_works(tache_as_array)
  if(inWork_works.length>0){
    let latest_DateEnd = inWork_works.reduce((r,v)=>moment(r.DateFin._text,'DD-MM-YYYY')>moment(v.DateFin._text,'DD-MM-YYYY')?v:r).DateFin._text
    return {nom:jsonify_xml.Document.Chantier.Espace.Nom._text,adresse:jsonify_xml.Document.Chantier.Espace.Adresse._text,date_fin:latest_DateEnd}
  }
  return undefined
}

const get_task_workDone = jsonify_xml => {
  let tache_as_array = convert_tache_as_array(jsonify_xml.Document.Chantier.Tache)
  let inWork_works = get_inWork_works(tache_as_array)
  if(inWork_works.length==0)
    return {nom:jsonify_xml.Document.Chantier.Espace.Nom._text,adresse:jsonify_xml.Document.Chantier.Espace.Adresse._text}
  return undefined
}

const get_folder = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(process.env.BASE_PATH, (err, files) => {
      if (err)
        throw new Error(err)
      resolve(files)
    })
  })
}

async function get_works() {
  const file_names = await get_folder()
  let result = []
  file_names.forEach(file_name=>{
    let path = `${process.env.BASE_PATH}/${file_name}/init.xml`
    if(fs.existsSync(path)){
      const xml = fs.readFileSync(path, 'utf8')
      const jsonify_xml = JSON.parse(convert.xml2json(xml, {compact: true, spaces: 4}))
      const work = get_task_inWork_with_latest_DateEnd(jsonify_xml)
      if(work)
        result.push(work)
    }  
  })
  return result
}

async function get_spaces() {
  const file_names = await get_folder()
  let result = []
  file_names.forEach(file_name=>{
    let path = `${process.env.BASE_PATH}/${file_name}/init.xml`
    if(fs.existsSync(path)){
      const xml = fs.readFileSync(path, 'utf8')
      const jsonify_xml = JSON.parse(convert.xml2json(xml, {compact: true, spaces: 4}))
      const work = get_task_workDone(jsonify_xml)
      if(work)
        result.push(work)
    }  
  })
  return result
}

app.get('/espaces/travaux', async (req, res) => {
  res.setHeader('content-type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment;filename=espaces_travaux.csv')
  const works = await get_works()
  res.send(['Nom;Adresse;DateFinTravaux',...works.map(e=>`${e.nom};${e.adresse};${e.date_fin}`)].join`\n`)
})

app.get('/espaces/ouverts', async (req, res) => {
  res.setHeader('content-type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment;filename=espaces_ouverts.csv')
  const works = await get_spaces()
  res.send(['Nom;Adresse',...works.map(e=>`${e.nom};${e.adresse}`)].join`\n`)
})


const port = process.env.PORT || 5225
const server = app.listen(port, () => console.log(`Listening at http://localhost:${port}`))
