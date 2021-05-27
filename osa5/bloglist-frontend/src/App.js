import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const LoginForm = ({ username, setUsername, password, setPassword, handleLogin }) => {

  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
            <input type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          password
            <input type="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)} />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

}

const BlogForm = ({ addBlog, blogTitle, setBlogTitle, blogAuthor, setBlogAuthor, blogUrl, setBlogUrl }) => {

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
      <div>
        title
          <input type="text" value={blogTitle} name="BlogTitle" onChange={({ target }) => setBlogTitle(target.value)} />
      </div>
      <div>
        author
          <input type="text" value={blogAuthor} name="BlogAuthor" onChange={({ target }) => setBlogAuthor(target.value)} />
      </div>
      <div>
        url
          <input type="text" value={blogUrl} name="BlogUrl" onChange={({ target }) => setBlogUrl(target.value)} />
      </div>
      <button type="submit">create</button>
      </form>
    </div>
  )
}

const Content = ({ user, handleLogout, blogs, addBlog, blogTitle, setBlogTitle, blogAuthor, setBlogAuthor, blogUrl, setBlogUrl }) => {
  return (
    <div>
      <h2>blogs</h2>
      <div>
        <p>{user.name} logged in </p>
        <button onClick={handleLogout}>logout</button>
      </div>
      <BlogForm
        addBlog={addBlog}
        blogTitle={blogTitle}
        setBlogTitle={setBlogTitle}
        blogAuthor={blogAuthor}
        setBlogAuthor={setBlogAuthor}
        blogUrl={blogUrl}
        setBlogUrl={setBlogUrl} />
      <div>
        { blogs.map(b => <Blog key={b.id} blog={b} />) }
      </div>
    </div>
  )
}

const App = () => {
  const [ blogs, setBlogs ] = useState([])
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ user, setUser ] = useState(null)
  const [ blogTitle, setBlogTitle ] = useState('')
  const [ blogAuthor, setBlogAuthor ] = useState('')
  const [ blogUrl, setBlogUrl ] = useState('')
  const [ notificationMessage, setNotificationMessage] = useState(null)
  const [ notificationType, setNotificationType] = useState('')

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

  const addBlog = (event) => {
    event.preventDefault()

    const blogObject = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl
    }

    blogService
      .create(blogObject)
        .then(b => {
          setBlogs(blogs.concat(b))
          setBlogTitle('')
          setBlogAuthor('')
          setBlogUrl('')

          notify(`a new blog ${b.title} by ${b.author} added`, 'success')
      })
      .catch(error => { notify(error.response.data.error, 'error') })

  }

  const notify = (msg, type) => {
    setNotificationMessage(msg)
    setNotificationType(type)
    setTimeout(() => {
      setNotificationMessage(null)
      setNotificationType('')
    }, 5000)
  }

  return (
    <div>
      <Notification
        message={notificationMessage}
        messageType={notificationType} />
      {
        user === null
          ? <LoginForm
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              handleLogin={handleLogin} />
          : <Content
              user={user}
              handleLogout={handleLogout}
              blogs={blogs}
              addBlog={addBlog}
              blogTitle={blogTitle}
              setBlogTitle={setBlogTitle}
              blogAuthor={blogAuthor}
              setBlogAuthor={setBlogAuthor}
              blogUrl={blogUrl}
              setBlogUrl={setBlogUrl} />
      }

    </div>
  )
}

export default App
