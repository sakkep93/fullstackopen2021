const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')


// get all blogs
blogsRouter.get('/', async (request, response) => {

  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs.map( b => b.toJSON()))
})

// create a new blog
blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const user = await User.findById(request.user)

  if (!user) {
    return response.status(404).json({
      error: 'User not found.'
    })
  }

  const body = request.body
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog.toJSON())
})

// update a blog
blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = { likes: body.likes }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog.toJSON())

})

// delete a blog
blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {

  const user = await User.findById(request.user)
  if (!user) {
    return response.status(404).json({
      error: 'User not found.'
    })
  }

  const blog = await Blog.findById(request.params.id)

  if ( blog.user.toString() !== user._id.toString() ) {

    // 403 Forbidden (to remove other people's blogs!)
    return response.status(403).json({
      error: 'Token does not match with the id of the creator of this blog. Delete denied.'
    })
  }

  user.blogs = user.blogs.filter(b => b !== blog._id)
  await user.save()
  await blog.remove()
  response.status(204).end()
})

module.exports = blogsRouter
