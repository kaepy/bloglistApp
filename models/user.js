const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// Salasanan validointi pitää tehä ennen hashausta, ja hashausta taas kun ei tietoturvasyistä kuulu tehä "vasta" kannan puolella nii kantavalidointeja ei voi käyttää salasanan validointiin

const userSchema = mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    maxlength: 20,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return /^[A-Za-z0-9_.-]+$/.test(value)
      },
      message: 'Username can only contain letters, numbers, ".", "_", and "-"',
    },
  },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User