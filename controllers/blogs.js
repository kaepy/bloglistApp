const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

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

/* refaktoroidaan middlewareksi
// Eristää tokenin headerista authorizationin
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}
*/

// Blogin luominen
blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  //console.log('request: ', request)

  // poimitaan lisättävän blogin tiedot requestista
  const body = request.body
  //console.log('body: ', body) // { author: 'HHHHHH', title: 'HHHHHH', url: 'HHHHHH', likes: 1 }

  // get user from request object
  const user = request.user
  //console.log('blogs/user: ', user)
  //console.log('user._id: ', user._id) // undefined
  //console.log('user._id: ', user.blogs) // undefined

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })
  //console.log('blog', blog)

  // Mitä tässä tapahtuu?
  // To save the current state of the blog object to the database
  const savedBlog = await blog.save()
  //console.log('savedBlog ', savedBlog)

  // lisää blogin käyttäjän tietoihin muiden blogien seuraksi
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

// Blogin poistaminen
blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  // blogi on hyvä hakea erikseen jos olis tarvetta tehdä tarkastuksia että blogi ylipäätänsä löytyy
  // haetaan requestin id:n perusteella blogin tiedot
  const blog = await Blog.findById(request.params.id)
  //console.log('blog: ', blog)
  //console.log('blog.user: ', blog.user)
  //console.log('blog.user.STRING: ', blog.user.toString())

  // poimitaan blogin tiedoista blogin luojan id
  const blogCreator = blog.user.toString()
  //console.log('blogCreator: ', blogCreator)

  // get user from request object
  const user = request.user
  //console.log('blogs/user: ', user)
  //console.log('user._id: ', user._id)
  //console.log('user._id: ', user.blogs)

  // poimitaan kirjautuneen käyttäjän id
  const loggedUser = user._id.toString()
  //console.log('loggedUser: ', loggedUser)

  // tarkastellaan onko blogin luonut käyttäjä ja kirjautunut käyttäjä sama
  if ( loggedUser === blogCreator ){
    await Blog.findByIdAndRemove(request.params.id) // alkuperänen
    return response.status(204).end() // alkuperänen
  }

  response.status(401).json({ error: 'invalid' })
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