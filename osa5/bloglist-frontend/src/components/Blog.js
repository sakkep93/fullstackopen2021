import React, { useState } from 'react'

const Blog = ({ blog, likeBlog, removeBlog }) => {

  const [ showAllInfo, setShowAllInfo ] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    marginTop: 5,
  }

  return (
    <div style={ blogStyle }>
      <span><b>{ blog.title }</b> by <i>{ blog.author }</i></span>
      <button onClick={ () => setShowAllInfo(!showAllInfo) }> { showAllInfo ? 'hide' : 'view' }</button>
      {
        showAllInfo
          ? <span>
            <br />
            <a href={ blog.url }> { blog.url } </a> <br />
            { blog.likes } likes <button onClick={likeBlog}>like</button> <br />
            { blog.user.name } <br />
            <button onClick={removeBlog}>remove</button>
          </span>
          : null
      }

    </div>
  )

}

export default Blog
