const {server, app} = require('./index.js')
const supertest = require('supertest')

afterAll(done => {
  server.close(done);
})



test("GET /espaces/ouverts", async () => {
  await supertest(app)
  .get("/espaces/ouverts")
  .expect(200)
  .then((response) => {
    expect(response.text).toEqual('Nom;Adresse\nParc Monceau;35 Boulevard de Courcelles, 75008 Paris\nRue piétonne du Poil-au-con;Rue du Pélican 75001 PARIS\nSalle Z;Plaque Télécom, Port Royal 74014 PARIS')
    })
})

test("GET /espaces/travaux", async () => {
  await supertest(app)
  .get("/espaces/travaux")
  .expect(200)
  .then((response) => {
    expect(response.text).toEqual('Nom;Adresse;DateFinTravaux\nPlace Pigalle;Place Pigalle 75009 PARIS;16-02-1998')
    })
})
