const _ = require('lodash')

// 4.3 DUMMY TEST
const dummy = (blogs) => {
  return 1
}

// 4.4 TOTAL LIKES CASES
const totalLikes = (blogs) => {
  return blogs.reduce((summa, blog) => summa + blog.likes, 0)
}

// 4.5 FAVORITE BLOG
const favoriteBlog = (blogs) => {
  const mostVotes = blogs.reduce((prev, current) => (+prev.likes > +current.likes) ? prev : current)

  const partialMostVotes = {
    title: mostVotes.title,
    author: mostVotes.author,
    likes: mostVotes.likes,
  }

  return partialMostVotes
}

// 4.6* AUTHOR WITH MOST BLOGS
const mostBlogs = (blogs) => {
  // grouppaa blogit authorin mukaan
  const byAuthors = _.groupBy(blogs, 'author')
  //console.log('byAuthors', byAuthors)

  // _.keys - palauttaa listan objektin kaikista keystä
  // _.map - luo uuden taulun with the results of a called function for every array element
  const result = Object.keys(byAuthors).map(author => {

    // _.groupBy(mitä, minkä mukaan) palauttaa objektit jossa saman authorin titlet ryhmitelty nippuun
    const byUniqueBlogs = _.groupBy(byAuthors[author], 'title')
    //console.log('byUniqueBlogs', byUniqueBlogs)

    return {
      'author': author,
      'blogs': Object.keys(byUniqueBlogs).length,
    }
  })
  //console.log('result', result)

  const mostBlogs = result.reduce((max, author) => max.blogs > author.blogs ? max : author)
  //console.log('mostBlogs', mostBlogs)

  return mostBlogs
}

// 4.7* AUTHOR WITH MOST LIKES
const mostLikes = (blogs) => {

  // grouppaa blogit authorin mukaan
  const byAuthors = _.groupBy(blogs, 'author')
  //console.log('byAuthors', byAuthors)

  const result = Object.keys(byAuthors).map(author => {

    // lasketaan authorien liket yhteen
    const totalLikes = byAuthors[author].reduce((sum, current) => sum + current.likes, 0)
    //console.log('totalLikes', totalLikes)

    return {
      'author': author,
      'likes': totalLikes
    }
  })
  //console.log('result', result)

  const mostLikes = result.reduce((max, author) => max.likes > author.likes ? max : author)
  //console.log('mostLikes', mostLikes)

  return mostLikes

}

// Additional solution
/*
result = _(blogs)
  .groupBy('Author')
  .map((array, key) => ({
    'author': key,
    'blogs': _.uniqBy(array, 'Title').length,
    'likes': _.sumBy(array, 'Likes')
  }))
  .value()

console.log(result)
*/

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}