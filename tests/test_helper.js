const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'HTML is medium',
    author: 'Person3',
    url: 'url3',
    likes: 3,
  },
  {
    title: 'HTML is low',
    author: 'Person1',
    url: 'url1',
    likes: 0,
  },
  {
    title: 'HTML is high',
    author: 'Person2',
    url: 'url2',
    likes: 1,
  }
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

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}