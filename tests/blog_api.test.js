const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

// npm test -- tests/blog_api.test.js // tiedoston perusteella
// npm test -- -t 'a specific blog is within the returned blogs' // testin nimen perusteella
// npm test -- -t 'blogs' // kaikki testit, joiden nimessä on sana blogs

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  /* 4.8 blogilistan testit, step 1
  Tee SuperTest-kirjastolla testit blogilistan osoitteeseen /api/blogs tapahtuvalle HTTP GET ‑pyynnölle. Testaa, että sovellus palauttaa oikean määrän JSON-muotoisia blogeja.

  Kun testi on valmis, refaktoroi operaatio käyttämään promisejen sijaan async/awaitia.

  Huomaa, että joudut tekemään koodiin materiaalin tapaan hieman muutoksia (mm. testausympäristön määrittely), jotta saat järkevästi tehtyä omaa tietokantaa käyttäviä API-tason testejä.

  Varoitus: Jos huomaat kirjoittavasi sekaisin async/awaitia ja then-kutsuja, on 99-prosenttisen varmaa, että teet jotain väärin. Käytä siis jompaakumpaa tapaa, älä missään tapauksessa "varalta" molempia.

  HUOM: Materiaalissa käytetään muutamaan kertaan matcheria toContain kun tarkastetaan, onko jokin arvo taulukossa. Kannattaa huomata, että metodi käyttää samuuden vertailuun ===-operaattoria ja olioiden kohdalla tämä ei ole useinkaan se mitä halutaan. Parempi vaihtoehto onkin toContainEqual. Tosin mallivastauksissa ei vertailla kertaakaan olioita matcherien avulla, joten ilmankin selviää varsin hyvin.
  */

  test('three blogs are returned as json', async () => {
    // supertest osuus
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // hyödynnetään supertestillä saatua responsea jesti expectissä
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  /* 4.9 blogilistan testit, step 2
  Tee testi, joka varmistaa että palautettujen blogien identifioivan kentän tulee olla nimeltään id. Oletusarvoisestihan tietokantaan talletettujen olioiden tunnistekenttä on _id. Olion kentän olemassaolon tarkastaminen onnistuu Jestin matcherillä toBeDefined.

  Muuta koodia siten, että testi menee läpi. Osassa 3 käsitelty toJSON on sopiva paikka parametrin id määrittelyyn.
  */

  test('the identifying field for returned blogs is called id', async () => {
    const response = await api.get('/api/blogs')
      .expect(200)

    console.log(response.body)

    response.body.forEach(blog => {
      expect(blog.id).toBeDefined()
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})