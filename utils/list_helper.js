
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((summa, blog) => summa + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const mostVotes = blogs.reduce((prev, current) => (+prev.likes > +current.likes) ? prev : current)

  const partialMostVotes = {
    title: mostVotes.title,
    author: mostVotes.author,
    likes: mostVotes.likes,
  }

  return partialMostVotes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}