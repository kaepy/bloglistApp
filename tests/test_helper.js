const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const initialBlogs = [
  {
    title: 'The Lord of the Blogs',
    author: 'J. R. R. Token',
    url: 'loordi url',
    likes: 42,
    user:
      {
        _id: '647451ea7a78ae6fc9786135'
      }
    ,
    _id: '6474f3b7e2ab2e8719835602',
    __v: 0
  },
  {
    title: 'The Lego Lasse',
    author: 'J. R. R. Token',
    url: 'loordi url',
    likes: 42,
    user:
      {
        _id: '647451ea7a78ae6fc9786135'
      }
    ,
    _id: '6474f4a8e2ab2e8719835612',
    __v: 0
  },
]

const initialUsers = [
  {
    username: 'testi',
    name: 'Testi Testinen',
    passwordHash: null,
    blogs: [
      {
        _id: '6474f3b7e2ab2e8719835602'
      },
      {
        _id: '6474f4a8e2ab2e8719835612'
      }
    ],
    _id: '647451ea7a78ae6fc9786135'
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