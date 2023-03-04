
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((summa, blog) => summa + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const mostVotes = blogs.reduce((prev, current) => (+prev.likes > +current.likes) ? prev : current)

  return mostVotes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}