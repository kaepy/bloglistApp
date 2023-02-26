require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors') // muista backendin baseUrl -> frontin axios!
const Blog = require('./models/blog')

app.use(cors()) //sallii kaikki pyynnöt kaikkiin express routeihin
app.use(express.json()) //json parseri

// tulostaa tulevien pyyntöjen perustietoja
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

/*
// request sisältää kaikki HTTP-pyynnön tiedot: GET
// response määrittää miten pyyntöön vastataan: SEND
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/blogs', (request, response) => {
  response.json(blogs)
})

app.get('/api/blogs/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/blogs/:id', (request, response, next) => {
  Blog.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const generateId = () => {
  const maxId = blogs.length > 0
    ? Math.max(...blogs.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/blogs', (request, response) => {
  const body = request.body
  if (body.title === undefined) {
    return response.status(400).json({ error: 'title missing' })
  }

  if (!body.title) {
    return response.status(400).json({
      error: 'title missing'
    })
  }

  const blog = {
    author: body.author,
    title: body.title,
    url: body.url,
    votes: body.votes,
    id: generateId(),
  }

  blogs = blogs.concat(blog)

  response.json(blog)
})

app.put('/api/blogs/:id', (request, response, next) => {
  const {title, author, url, likes} = request.body

  const blog = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
  }

  Blog.findByIdAndUpdate(
    request.params.id,
    {title, author, url, likes},
    { new: true, runValidator: true, context: 'query' }
  )
    .then(updatedBlog => {
      response.json(updatedBlog)
    })
    .catch(error => next(error))
})
*/

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})


app.post('/api/blogs', (request, response, next) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)

// virheellisten pyyntöjen käsittely
app.use(errorHandler)


// app muuttujaan sijoitettu http-palvelin kuuntelee porttiin tulevia HTTP-pyyntöjä
const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})