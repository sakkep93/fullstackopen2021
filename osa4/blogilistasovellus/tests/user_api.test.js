const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const bcrypt = require('bcrypt')
const User = require('../models/user')

describe('when there is initially one user in database', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('mypassword', 10)
    const user = new User({ username: 'myuser', passwordHash })

    await user.save()
  })

  describe('creation of a user', () => {

    test('succeeds with a fresh username', async () => {

      const usersBefore = await helper.usersInDb()

      const newUser = {
        username: 'sakkep',
        name: 'Sakari Pöyhiä',
        password: 'salasana'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAfter = await helper.usersInDb()
      expect(usersAfter).toHaveLength(usersBefore.length + 1)

      const usernames = usersAfter.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })

    test('fails with status code 400 and message if username already taken', async () => {
      const usersBefore = await helper.usersInDb()

      const newUser = {
        username: 'myuser',
        name: 'My User',
        password: 'top secret'
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(response.body.error).toContain('`username` to be unique')

      const usersAfter = await helper.usersInDb()
      expect(usersAfter).toHaveLength(usersBefore.length)

    })

    test('fails with status code 400 and message if username is not provided', async () => {

      const usersBefore = await helper.usersInDb()

      const newUser = {
        name: 'My User',
        password: 'top secret'
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(response.body.error).toContain('`username` is required')

      const usersAfter = await helper.usersInDb()
      expect(usersAfter).toHaveLength(usersBefore.length)
    })

    test('fails with status code 400 and message if username has less than 3 characters', async () => {

      const usersBefore = await helper.usersInDb()

      const newUser = {
        username: 'me',
        name: 'My User',
        password: 'top secret'
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const errMsg = '`username` ' + '(`' + newUser.username + '`) is shorter than the minimum allowed length (3)'

      expect(response.body.error).toContain(errMsg)

      const usersAfter = await helper.usersInDb()
      expect(usersAfter).toHaveLength(usersBefore.length)
    })

    test('fails with status code 400 if password is not provided', async () => {
      const usersBefore = await helper.usersInDb()

      const newUser = {
        username: 'meheeehee',
        name: 'My User',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAfter = await helper.usersInDb()
      expect(usersAfter).toHaveLength(usersBefore.length)
    })

    test('fails with status code 400 if password has less than 3 characters', async () => {
      const usersBefore = await helper.usersInDb()

      const newUser = {
        username: 'meheeehee',
        name: 'My User',
        password: 'me'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAfter = await helper.usersInDb()
      expect(usersAfter).toHaveLength(usersBefore.length)
    })


  })
})

afterAll(() => {
  mongoose.connection.close()
})
