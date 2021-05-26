const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Best Title Ever',
    author: 'Unnamed Genious',
    url: 'url/to/the/best/article/ever.pdf',
    likes: 100
  },
  {
    title: 'Worst Title Ever',
    author: 'Unnamed Dummy',
    url: 'url/to/the/worst/article/ever.pdf',
    likes: 0
  }
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'thiswillberemovedshortly',
    author: 'tester',
    url: 'not/important/since/this/blog/entry/disappears/anyway.pdf',
    likes: 69
  })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}
