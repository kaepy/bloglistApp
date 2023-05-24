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

  describe('addition of a new blog', () => {

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

      // console.log(response.body)

      expect(response.body.likes).toBe(0)
    })

    test('fails with statuscode 400 if title or url is invalid', async () => {
      const newBlog = {
        author: 'Person999',
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      // console.log(blogsAtEnd)

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

      const titles = blogsAtEnd.map(r => r.title)
      expect(titles).not.toContain(blogToDelete.title)
    })
  })

  /*
  4.14*: blogilistan testit, step 2
  Toteuta sovellukseen mahdollisuus yksittäisen blogin muokkaamiseen. Käytä async/awaitia.
  Tarvitsemme muokkausta lähinnä likejen lukumäärän päivittämiseen. Toiminnallisuuden voi toteuttaa samaan tapaan kuin muistiinpanon päivittäminen toteutettiin osassa 3.

  Toteuta ominaisuudelle myös testit.
  */

  describe('modification of a blog', () => {
    test('succeeds with valid id', async () => {
      const modifiedBlog = {
        likes: 999,
      }

      const blogsAtStart = await helper.blogsInDb()
      const blogToModify = blogsAtStart[0]

      //console.log(blogToModify)

      await api
        .put(`/api/blogs/${blogToModify.id}`)
        .send(modifiedBlog)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      const blogAfterMod = blogsAtEnd[0]

      //console.log(blogAfterMod)

      expect(blogAfterMod.likes).toBe(modifiedBlog.likes)
    })

  })
})

afterAll(async () => {
  await mongoose.connection.close()
})