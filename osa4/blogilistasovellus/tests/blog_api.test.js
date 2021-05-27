const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const bcrypt = require('bcrypt')

const Blog = require('../models/blog')
const User = require('../models/user')

describe('when there is initially some users but no blogs saved', () => {
  beforeAll(async () => {
    await User.deleteMany({})

    const saltRounds = 10
    for (let user of helper.initialUsers) {
      let passwordHash = await bcrypt.hash(user.password, saltRounds)
      let userObj = new User({
        username: user.username,
        name: user.name,
        passwordHash,
      })

      await userObj.save()
    }
  })

  describe('addition of a new blog', () => {
    test('succeeds if done by a logged in user and with valid blog data', async () => {
      const user = helper.initialUsers[0]
      const body = { username: user.username, password: user.password }
      const blogsBefore = await helper.blogsInDb()

      // login
      const response1 = await api
        .post('/api/login')
        .send(body)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      // add a new blog
      const newBlog = {
        title: 'The Greatest Love Story of the Century',
        author: user.name,
        url: '/path/to/blog',
        likes: 0
      }

      const response2 = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${response1.body.token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAfter = await helper.blogsInDb()

      // check amount increased
      expect(blogsAfter).toHaveLength(blogsBefore.length + 1)

      // check new blog is in db
      expect(
        blogsAfter
          .map(b => ({ ...b, user: b.user.toString() }))
      ).toContainEqual(response2.body)

      const usersInDb = await helper.usersInDb()
      const userWithBlog = usersInDb[0]

      // check blogs under user contains newly created blog
      expect(
        userWithBlog
          .blogs
          .map(blogIdObject => blogIdObject.toString())
      ).toContainEqual(response2.body.id)

      // check newly created blog has user id
      expect(response2.body.user.toString()).toEqual(userWithBlog.id)
    })
    test('succeeds if done by a logged in user and likes is not given (default 0)', async () => {
      const user = helper.initialUsers[0]
      const body = { username: user.username, password: user.password }
      const blogsBefore = await helper.blogsInDb()

      // login
      const response1 = await api
        .post('/api/login')
        .send(body)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      // add a new blog
      const newBlog = {
        title: 'The Greatest Love Story of the Century',
        author: user.name,
        url: '/path/to/blog'
      }

      const response2 = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${response1.body.token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAfter = await helper.blogsInDb()

      // check amount increased
      expect(blogsAfter).toHaveLength(blogsBefore.length + 1)

      // check new blog is in db
      expect(
        blogsAfter
          .map(b => ({ ...b, user: b.user.toString() }))
      ).toContainEqual(response2.body)

      const usersInDb = await helper.usersInDb()
      const userWithBlog = usersInDb[0]

      // check blogs under user contains newly created blog
      expect(
        userWithBlog
          .blogs
          .map(blogIdObject => blogIdObject.toString())
      ).toContainEqual(response2.body.id)

      // check newly created blog has user id
      expect(response2.body.user.toString()).toEqual(userWithBlog.id)

      // check new blog has 0 likes
      expect(response2.body.likes).toEqual(0)
    })
    test('fails with status code 400 when a blog without title and url is added', async () => {
      const user = helper.initialUsers[0]
      const body = { username: user.username, password: user.password }
      const blogsBefore = await helper.blogsInDb()

      // login
      const response1 = await api
        .post('/api/login')
        .send(body)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      // add a new blog
      const newBlog = {
        author: user.name,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${response1.body.token}`)
        .expect(400)

      const blogsAfter = await helper.blogsInDb()

      // check number of blogs stays same
      expect(blogsAfter).toHaveLength(blogsBefore.length)
    })
    test('fails with status code 401 when a user is not logged in', async () => {
      const user = helper.initialUsers[0]
      const blogsBefore = await helper.blogsInDb()

      // no login, no token

      // add a new blog
      const newBlog = {
        title: 'The Greatest Love Story of the Century',
        author: user.name,
        url: '/path/to/blog',
        likes: 0
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

      const blogsAfter = await helper.blogsInDb()

      // check number of blogs stays same
      expect(blogsAfter).toHaveLength(blogsBefore.length)
    })
  })
  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if user is logged in and is authorized', async () => {
      const blogsBefore = await helper.blogsInDb()
      const blogToDelete = blogsBefore[0]

      const user = helper.initialUsers[0]
      const body = { username: user.username, password: user.password }

      // login
      const response = await api
        .post('/api/login')
        .send(body)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      // delete
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `bearer ${response.body.token}`)
        .expect(204)

      const blogsAfter = await helper.blogsInDb()
      expect(blogsAfter).toHaveLength(blogsBefore.length - 1)
      expect(blogsAfter).not.toContainEqual(blogToDelete)
    })
    test('fails with status code 401 if user is not logged in', async () => {
      const blogsBefore = await helper.blogsInDb()
      const blogToDelete = blogsBefore[0]

      // no login

      // delete
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401)

      const blogsAfter = await helper.blogsInDb()
      expect(blogsAfter).toHaveLength(blogsBefore.length)
    })
    test('fails with status code 403 when user tries to delete blog of other user', async () => {
      const blogsBefore = await helper.blogsInDb()
      const blogToDelete = blogsBefore[0]

      const user = helper.initialUsers[1]
      const body = { username: user.username, password: user.password }

      // login
      const response = await api
        .post('/api/login')
        .send(body)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      // delete
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `bearer ${response.body.token}`)
        .expect(403)

      const blogsAfter = await helper.blogsInDb()
      expect(blogsAfter).toHaveLength(blogsBefore.length)
    })
  })
  describe('modification of a blog', () => {
    test('succeeds so that only likes field is changed', async () => {
      const blogsBefore = await helper.blogsInDb()
      const blog = blogsBefore[0]

      const newData = { title: 'lol', author: 'mister', url: 'somepath', likes: blog.likes + 10 }

      const response = await api
        .put(`/api/blogs/${blog.id}`)
        .send(newData)
        .expect(200)

      const blogsAfter = await helper.blogsInDb()

      expect(blogsAfter).toHaveLength(blogsBefore.length)
      expect(response.body.likes).not.toEqual(blog.likes)
      expect(response.body.likes).toEqual(newData.likes)
      expect(response.body.title).not.toEqual(newData.title)
      expect(response.body.author).not.toEqual(newData.author)
      expect(response.body.url).not.toEqual(newData.url)

    })
  })

})

describe('now that there still is some users and blogs in database', () => {

  test('all blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(1)
  })
  test('all blogs have a field id instead of _id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach( (blog) => {
      expect(blog.id).toBeDefined()
      expect(blog._id).toBeUndefined()
    })
  })
})

afterAll(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  mongoose.connection.close()
})
