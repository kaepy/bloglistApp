const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(400).json({ error: 'token missing or invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  // hakee authorization headerin requestista
  const authorization = request.get('authorization')

  // jos authorization header on olemassa ja alkaa oikealla sanalla
  if (authorization && authorization.startsWith('Bearer ')) {
    // korvaa authorization Stringistä 'Bearer ' -> '' eli tavallaan poistetaan 'Bearer '-prefix ja jäljelle jää pelkkä token. Juontaa juurensa HTTP:n Authorization headeriin jossa formaatti on <tyyppi> <arvo>. Halutaan siis pelkkä arvo ilman tyyppimäärettä.
    request.token = authorization.replace('Bearer ', '')
  }

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor
}