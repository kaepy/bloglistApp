const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const initialBlogs = [
  {
    title: 'HTML is medium',
    author: 'Person3',
    url: 'url3',
    likes: 3,
    user: null
  },
  {
    title: 'HTML is low',
    author: 'Person1',
    url: 'url1',
    likes: 0,
    user: null
  },
  {
    title: 'HTML is high',
    author: 'Person2',
    url: 'url2',
    likes: 1,
    user: null
  }
]

const initialUsers = [
  {
    username: 'testi',
    name: 'testi testinen',
    password: 'salasala',
  },
  {
    username: 'fakeUser',
    name: 'testi testinen',
    password: 'salasala'
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const testUserToken = async () => {
  // haetaan kaikki userit testikannasta
  const users = await usersInDb()
  //console.log('users : ', users)

  // käytetään ekaa käyttäjää
  const testUser = users[0]
  //console.log('testUser : ', testUser)

  // apumuuttuja tokenin luomista varten
  const userForToken = {
    username: testUser.username,
    id: testUser.id,
  }
  //console.log('userForToken: ', userForToken)

  // Salasanaa ei tarvita - pelkkä token riittää
  // Luodaan metodin avulla token
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60 * 60 }
  )
  //console.log('helper token: ', token)

  return token
}

module.exports = {
  initialBlogs, initialUsers, nonExistingId, blogsInDb, usersInDb, testUserToken
}