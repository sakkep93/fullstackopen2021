const logger = require('./logger')
const jwt = require('jsonwebtoken')

const requestLogger = (req, res, next) => {

  if (req.method === 'POST') {
    logger.info(req.method, req.path, res.statusCode, '-', req.body)
  } else {
    logger.info(req.method, req.path, res.statusCode, '-')
  }
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
    return response.status(401).json({
      error: 'invalid token'
    })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  next(error)
}

const getTokenFrom = req => {
  const auth = req.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    return auth.substring(7)
  }
  return null
}

const tokenExtractor = (request, response, next) => {

  const token = getTokenFrom(request)
  request.token = token

  next()
}

const userExtractor = (request, response, next) => {
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)

  if( !token || !decodedToken.id ) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  request.user = decodedToken.id
  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}
