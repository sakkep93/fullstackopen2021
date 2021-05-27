const Blog = require('../models/blog')
const User = require('../models/user')

const initialUsers = [
  {
    username: 'romeo111',
    password: 'ilovejulia',
    name: 'Romeo'
  },
  {
    username: 'julia999',
    password: 'iloveromeo',
    name: 'Julia'
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = { blogsInDb, usersInDb, initialUsers }
