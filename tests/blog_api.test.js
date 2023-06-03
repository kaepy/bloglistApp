const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const Blog = require('../models/blog')
const User = require('../models/user')

// npm test -- tests/blog_api.test.js // tiedoston perusteella
// npm test -- -t 'a specific blog is within the returned blogs' // testin nimen perusteella
// npm test -- -t 'blogs' // kaikki testit, joiden nimessä on sana blogs

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    // initialize blogs
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)

    // initialize users
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
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

      // Luo kirjautuneen käyttäjän ja sille tokenin joka otetaan talteen
      const authToken = await helper.testUserToken()

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      // tarkistetaan että kannassa on yksi blogi enemmän
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      // tarkistetaan että uusi blogi löytyy kannasta
      const titles = blogsAtEnd.map(b => b.title)
      expect(titles).toContain('Test is test na naaa naa na na')

      expect(response.body.user).not.toBeNull()
    })

    test('likes default value set to 0 if no other value given', async () => {
      const newBlog = {
        title: 'Test zero',
        author: 'Person999',
        url: 'url999',
      }

      const authToken = await helper.testUserToken()

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`)
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

      const authToken = await helper.testUserToken()

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      // console.log(blogsAtEnd)

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      // Tehdään kannasta kopio alkutilanteelle ja poimitaan mikä blogi poistetaan
      const blogsAtStart = await helper.blogsInDb()
      //console.log('blogsAtStart: ', blogsAtStart)

      const blogToDelete = blogsAtStart[0]
      //console.log('blogToDelete: ', blogToDelete.id)

      // Luo kirjautuneen käyttäjän ja sille tokenin joka otetaan talteen
      const authToken = await helper.testUserToken()
      //console.log('authToken: ', authToken)

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      // Tarkistetaan että kannassa on yksi blogi vähemmän
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

      // Tarkistetaan että poistettua blogia ei enää löydy kannasta
      const titles = blogsAtEnd.map(r => r.title)
      expect(titles).not.toContain(blogToDelete.title)
    })

    test('fails with statuscode 401 if token is missing', async () => {
      // Tehdään kannasta kopio alkutilanteelle ja poimitaan mikä blogi poistetaan
      const blogsAtStart = await helper.blogsInDb()
      //console.log('blogsAtStart: ', blogsAtStart)

      const blogToDelete = blogsAtStart[0]
      //console.log('blogToDelete: ', blogToDelete)

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', 'Bearer ')
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()

      // Tarkistetaan että kannassa on yhtä monta blogia
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

      // Tarkistetaan ettei poistettu blogi löytyy kannasta
      const titles = blogsAtEnd.map(r => r.title)
      expect(titles).toContain(blogToDelete.title)
    })
  })

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

  describe('when there is initially one user at db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
      //await User.insertMany(helper.initialUsers)

      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })

      await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'matti_meikalainen',
        name: 'Matti Meikäläinen',
        password: 'salainen',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('expected `username` to be unique')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username is missing', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: '',
        name: 'Test User',
        password: 'salainen',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('User validation failed: username: Path `username` is required.')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username is too short', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'te',
        name: 'Test User',
        password: 'salainen',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('User validation failed: username: Path `username` (`te`) is shorter than the minimum allowed length (3).')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if password is missing', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'testUser',
        name: 'Test User',
        password: '',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('password missing.')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if password is too short', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'testUser',
        name: 'Test User',
        password: 'sa',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('password is shorter than the minimum allowed length (3).')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})