
const express = require('express')
const app = express()
const cors = require('cors') // muista backendin baseUrl -> frontin axios!
//const mongoose = require('mongoose')

/*
const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})
*/

//const Blog = mongoose.model('Blog', blogSchema)

//const mongoUrl = 'mongodb://localhost/bloglist'
//mongoose.connect(mongoUrl)

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

let blogs = [
  {
    id: 1,
    author: "Person1",
    title: "HTML is easy",
    url: "url1",
    votes: 0
  },
  {
    id: 2,
    author: "Person2",
    title: "HTML is hard",
    url: "url2",
    votes: 2
  },
  {
    id: 3,
    author: "Person3",
    title: "HTML is medium",
    url: "url3",
    votes: 3
  }
]

// request sisältää kaikki HTTP-pyynnön tiedot: GET
// response määrittää miten pyyntöön vastataan: SEND
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/blogs', (request, response) => {
  response.json(blogs)
})

app.get('/api/blogs/:id', (request, response) => {
  const id = Number(request.params.id)
  const blog = blogs.find(blog => blog.id === id)
  response.json(blog)
})

app.delete('/api/blogs/:id', (request, response) => {
  const id = Number(request.params.id)
  blogs = blogs.filter(blog => blog.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const maxId = blogs.length > 0
    ? Math.max(...blogs.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/blogs', (request, response) => {
  const body = request.body

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

/*
app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})
*/
/*
app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})
*/

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

// app muuttujaan sijoitettu http-palvelin kuuntelee porttiin tulevia HTTP-pyyntöjä
const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})