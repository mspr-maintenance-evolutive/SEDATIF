var fs = require('fs');
var convert = require('xml-js');
var moment = require('moment')
var {Parser} = require('json2csv')

function listAllFiles(){
    let listPlaces = []
    let mainFolders = fs.readdirSync(process.env.FILE_DIRECTORY)
    mainFolders.forEach(dir => {
        let files = fs.readdirSync(`${process.env.FILE_DIRECTORY}/${dir}`)
        initFile = files.filter(file => file == 'init.xml')
        initFile.forEach(file => {
            let data = fs.readFileSync(`${process.env.FILE_DIRECTORY}/${dir}/${file}`)
            let xml_json = convert.xml2json(data, {compact: true})
            listPlaces.push(JSON.parse(xml_json))
        });
    })
    return listPlaces
}

function getPlacesInWork(listPlaces) {
    return listPlaces.map(place => {
        let mostRecentSatuts
        if(place.Document.Chantier.Tache.length !== undefined){
            mostRecentSatuts = place.Document.Chantier.Tache.reduce((a, b) => moment(a.DateFin._text, 'DD-MM-YYYY') > moment(b.DateFin._text, 'DD-MM-YYYY') ? a : b);
        } else {
            mostRecentSatuts = place.Document.Chantier.Tache
        }
        if(mostRecentSatuts.Etat._text == 'En cours'){
            let newPlace = {}
            newPlace.name = place.Document.Chantier.Espace.Nom._text
            newPlace.address = place.Document.Chantier.Espace.Adresse._text
            newPlace.endWork = mostRecentSatuts.DateFin._text
            return newPlace
        }
    }
    ).filter(v => v)
}

function getOpenplace(listPlaces) {
    return listPlaces.map(place => {
        let mostRecentSatuts
        if(place.Document.Chantier.Tache.length !== undefined){
            mostRecentSatuts = place.Document.Chantier.Tache.reduce((a, b) => moment(a.DateFin._text, 'DD-MM-YYYY') > moment(b.DateFin._text, 'DD-MM-YYYY') ? a : b);
        } else {
            mostRecentSatuts = place.Document.Chantier.Tache
        }
        if(mostRecentSatuts.Etat._text == 'Terminée'){
            let newPlace = {}
            newPlace.name = place.Document.Chantier.Espace.Nom._text
            newPlace.address = place.Document.Chantier.Espace.Adresse._text
            return newPlace
        }
    }
    ).filter(v => v)
}

function espacesEnTravaux(){
    let listPlaces = listAllFiles()
    let placesInWork = getPlacesInWork(listPlaces)
    let json2csv = new Parser({
        fields: [{
            label: 'Nom',
            value: 'name'
          },
          {
            label: 'Adresse',
            value: 'address'
          },
          {
            label: 'Fin des travaux',
            value: 'endWork'
          }],
          delimiter: ";"
    });
    let csv = json2csv.parse(placesInWork);
    return csv
}

function espacesOuverts(){
    let listPlaces = listAllFiles()
    let placesOpen = getOpenplace(listPlaces)
    let json2csv = new Parser({
        fields: [{
            label: 'Nom',
            value: 'name'
          },
          {
            label: 'Adresse',
            value: 'address'
          }],
          delimiter: ";"
    });
    let csv = json2csv.parse(placesOpen);
    return csv
}

module.exports = { espacesEnTravaux, espacesOuverts }