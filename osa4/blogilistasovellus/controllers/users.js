const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// create a user
usersRouter.post('/', async (request, response) => {
  const body = request.body

  const pw = body.password

  if (!pw) {
    return response.status(400).json({
      error: 'Invalid password. Password must be provided when creating a user.'
    })
  }

  if ( pw.length < 3 ) {
    return response.status(400).json({
      error: 'Invalid password. Password must have more than 2 characters.'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(pw, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter

// get all users
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { title: 1, author: 1, url: 1, likes: 1, id: 1 })
  response.json(users.map(u => u.toJSON()))
})
