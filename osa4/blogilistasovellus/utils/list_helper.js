const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {

  const reducer = (prev, cur) => {
    return prev.likes >= cur.likes ? prev : cur
  }

  return blogs.length === 0
    ? null
    : blogs.reduce(reducer)
}

const mostBlogs = (blogs) => {

  if ( blogs.length === 0 ) {
    return null
  } else {
    const authors = blogs.map(blog => blog.author)
    const authorWithMostBlogs = authors.reduce((prev, curr, _, arr) =>
      arr.filter( item => item === prev ).length >
      arr.filter( item => item === curr ).length
        ? prev
        : curr
    )
    return {
      'author': authorWithMostBlogs,
      'blogs': authors.filter( author => author === authorWithMostBlogs).length
    }
  }
}

const mostLikes = (blogs) => {

  if ( blogs.length === 0 ) {
    return null
  } else {
    const authors = [...new Set(blogs.map(blog => blog.author))]
    const aToObj = (author, authorBlogs) => {
      return {
        'author': author,
        'likes': authorBlogs.reduce( (sum, blog) => sum + blog.likes, 0)
      }
    }
    const results = authors.map( a => aToObj(a, blogs.filter( blog => blog.author === a )))

    return results.reduce( (prev, curr) => prev.likes > curr.likes ? prev : curr)
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
