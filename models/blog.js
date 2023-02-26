const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const mongoUrl = process.env.MONGODB_URI

console.log('connecting to', mongoUrl)

mongoose.connect(mongoUrl)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 5,
    required: true
  },
  author: String,
  url: String,
  likes: Number
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)