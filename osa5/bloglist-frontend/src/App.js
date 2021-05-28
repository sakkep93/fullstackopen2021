import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [ blogs, setBlogs ] = useState([])
  const [ notificationMessage, setNotificationMessage] = useState(null)
  const [ notificationType, setNotificationType] = useState('')

  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ user, setUser ] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => setBlogs( blogs ))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem( 'loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      notify('wrong username or password', 'error')
    }
  }
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    blogService.setToken(null)
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()

    blogService
      .create(blogObject)
      .then(b => {
        setBlogs(blogs.concat(b))
        notify(`a new blog ${b.title} by ${b.author} added`, 'success')
      })
      .catch(error => { notify(error.response.data.error, 'error') })

  }

  const likeBlog = (blogObject) => {

    const data = {
      user: blogObject.user.id,
      likes: blogObject.likes + 1,
      author: blogObject.author,
      title: blogObject.title,
      url: blogObject.url
    }

    blogService
      .update(blogObject.id, data)
      .then(returnedBlog => {
        setBlogs(blogs.map(b => b.id !== blogObject.id ? b: returnedBlog))
      })
      .catch(error => { notify(error.response.data.error, 'error') })
  }

  const removeBlog = (blogObject) => {

    const id = blogObject.id
    const title = blogObject.title
    const author = blogObject.author

    if (window.confirm(`Remove blog ${title} by ${author}`)) {
      blogService
        .remove(id)
        .then(() => {
          setBlogs(blogs.filter(b => b.id !== id ))
          notify(`Removed blog ${title} by ${author}`, 'success')
        })
        .catch(error => { notify(error.response.data.error, 'error') })
    }
  }

  const notify = (msg, type) => {
    setNotificationMessage(msg)
    setNotificationType(type)
    setTimeout(() => {
      setNotificationMessage(null)
      setNotificationType('')
    }, 5000)
  }

  const loginForm = () => (
    <Togglable buttonLabel='log in'>
      <LoginForm
        username={ username }
        password={ password }
        handleUsernameChange={ ({ target }) => setUsername(target.value) }
        handlePasswordChange={ ({ target }) => setPassword(target.value) }
        handleSubmit={ handleLogin } />
    </Togglable>
  )

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={ blogFormRef }>
      <BlogForm createBlog={ addBlog } />
    </Togglable>
  )

  return (
    <div>
      <h1>Blogs App</h1>
      <Notification
        message={notificationMessage}
        messageType={notificationType} />
      {
        user === null
          ? loginForm()
          : <div>
            <p>{ user.name } logged in </p>
            <button style={{ marginBottom: 5 }} onClick={ handleLogout }>logout</button>
            { blogForm() }
          </div>
      }
      <div id="blog-list">
        { blogs.sort((a, b) => b.likes - a.likes ).map(b =>
          <Blog
            key={b.id}
            blog={b}
            likeBlog={() => likeBlog(b) }
            removeBlog={() => removeBlog(b) } />)
        }
      </div>
    </div>
  )
}

export default App
