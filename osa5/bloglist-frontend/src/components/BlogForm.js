import React, { useState } from 'react'

const BlogForm = ({ createBlog }) => {

  const [ blogTitle, setBlogTitle ] = useState('')
  const [ blogAuthor, setBlogAuthor ] = useState('')
  const [ blogUrl, setBlogUrl ] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = { title: blogTitle, author: blogAuthor, url: blogUrl }

    createBlog(blogObject)

    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
  }

  const inputStyle = { marginLeft: 5, marginBottom: 5 }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={ addBlog }>
      <div>
        title
          <input
            style={inputStyle}
            type="text"
            value={ blogTitle }
            name="BlogTitle"
            onChange={ ({ target }) => setBlogTitle(target.value) }
          />
      </div>
      <div>
        author
          <input
            style={inputStyle}
            type="text"
            value={blogAuthor}
            name="BlogAuthor"
            onChange={ ({ target }) => setBlogAuthor(target.value) }
          />
      </div>
      <div>
        url
          <input
            style={inputStyle}
            type="text"
            value={blogUrl}
            name="BlogUrl"
            onChange={ ({ target }) => setBlogUrl(target.value) }
          />
      </div>
      <button style={{ marginBottom: 5 }} type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
