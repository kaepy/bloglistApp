// logitus
const info = (...params) => {
  console.log(...params)
}

// virhetilanteet
const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info, error
}