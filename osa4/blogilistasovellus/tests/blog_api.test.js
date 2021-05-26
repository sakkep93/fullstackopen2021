const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('all blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('all blogs have a field id instead of _id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach( (blog) => {
      expect(blog.id).toBeDefined()
      expect(blog._id).toBeUndefined()
    })
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'The Title',
        author: 'Mr. Author',
        url: '/path/to/blog',
        likes: 10
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAfterAddition = await helper.blogsInDb()
      expect(blogsAfterAddition).toHaveLength(helper.initialBlogs.length + 1)
      expect(blogsAfterAddition).toContainEqual(response.body)
    })

    test('succeeds when likes is not given since a default value of 0 is assigned to it', async () => {
      const newBlog = {
        title: 'The Title',
        author: 'Mr. Author',
        url: '/path/to/blog'
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAfterAddition = await helper.blogsInDb()
      expect(blogsAfterAddition).toHaveLength(helper.initialBlogs.length + 1)
      expect(blogsAfterAddition).toContainEqual(response.body)
      expect(response.body.likes).toEqual(0)
    })

    test('fails with status code 400 when a blog without title and url is added', async () => {
      const newBlog = { author: 'Me' }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAfterAddition = await helper.blogsInDb()
      expect(blogsAfterAddition).toHaveLength(helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsBeforeDeletion = await helper.blogsInDb()
      const blogToDelete = blogsBeforeDeletion[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAfterDeletion = await helper.blogsInDb()
      expect(blogsAfterDeletion).toHaveLength(blogsBeforeDeletion.length - 1)
      expect(blogsAfterDeletion).not.toContainEqual(blogToDelete)
    })
  })

  describe('modification of a blog', () => {
    test('succeeds so that only likes value changes', async () => {
      const blogsBeforeUpdate = await helper.blogsInDb()
      const blogToUpdate = blogsBeforeUpdate[0]

      const newData = {
        title: 'The Title',
        author: 'Mr. Author',
        url: '/path/to/blog',
        likes: blogToUpdate.likes + 10
      }

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(newData)
        .expect(200)

      const blogsAfterUpdate = await helper.blogsInDb()
      expect(blogsAfterUpdate).toHaveLength(blogsBeforeUpdate.length)
      expect(response.body.likes).not.toEqual(blogToUpdate.likes)
      expect(response.body.likes).toEqual(newData.likes)
      expect(response.body.title).not.toEqual(newData.title)
      expect(response.body.author).not.toEqual(newData.author)
      expect(response.body.url).not.toEqual(newData.url)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
