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

  test('three blogs are returned as json', async () => {
    // supertest osuus
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // hyödynnetään supertestillä saatua responsea jesti expectissä
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('the identifying field for returned blogs is called id', async () => {
    const response = await api.get('/api/blogs')
      .expect(200)

    response.body.forEach(blog => expect(blog.id).toBeDefined())
  })
})

describe('addition of a new note', () => {
  test('succeed with valid data', async () => {
    const newBlog = {
      title: 'Test is test na naaa naa na na',
      author: 'Person999',
      url: 'url999',
      likes: 999,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain('Test is test na naaa naa na na')
  })

  /* 4.11 blogilistan testit, step 3
  4.11*: blogilistan testit, step4
  Tee testi, joka varmistaa, että jos kentälle likes ei anneta arvoa, asetetaan sen arvoksi 0. Muiden kenttien sisällöstä ei tässä tehtävässä vielä välitetä.

  Laajenna ohjelmaa siten, että testi menee läpi.
  */

  test('likes default value set to 0 if no other value given', async () => {
    const newBlog = {
      title: 'Test zero',
      author: 'Person999',
      url: 'url999',
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    console.log(response.body)

    expect(response.body.likes).toBe(0)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})