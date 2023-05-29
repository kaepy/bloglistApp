const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  //const blogs = await Blog.find({})
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

// Yksittäisen blogin näyttäminen
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

// Eristää tokenin headerista authorizationin
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

// Blogin luominen
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  //const user = await User.findOne({})

  // tokenin oikeellisuuden tarkistus ja dekaadaus eli palauttaa olion jonka perusteella token on laadittu. dekoodatun olion sisällä on kentät username ja id eli se kertoo palvelimelle kuka pyynnön on tehnyt.
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)

  // Jos token on muuten kunnossa, mutta tokenista dekoodattu olio ei sisällä käyttäjän identiteettiä (eli decodedToken.id ei ole määritelty), palautetaan virheestä kertova statuskoodi 401 unauthorized ja kerrotaan syy vastauksen bodyssä
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  //console.log('user', user)
  //console.log('_id', user._id)
  //console.log('id', user._id.toString())

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  //console.log('blog', blog)

  const savedBlog = await blog.save()
  //console.log('savedBlog ', savedBlog)
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

// Blogin poistaminen
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

// Blogin muokkaaminen
blogsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(updatedBlog => {
      response.json(updatedBlog)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter