import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {

  test('renders title and author by default but not url, name of user nor likes', () => {

    const user = { name: 'Teh User' }
    const blog = {
      title: 'Testing components can be achieved using react-testing-library',
      author: 'Me',
      url: 'this/path/takes/you/to/this/blog.html',
      likes: 69,
      user: user
    }

    const component = render(
      <Blog blog={ blog } />
    )

    expect(component.container).toHaveTextContent(
      'Testing components can be achieved using react-testing-library by Me'
    )
  })
  test('renders also url, likes and name of user once view button clicked', () => {

    const user = { name: 'Teh User' }
    const blog = {
      title: 'Testing components can be achieved using react-testing-library',
      author: 'Me',
      url: 'this/path/takes/you/to/this/blog.html',
      likes: 69,
      user: user
    }

    const component = render( <Blog blog={ blog } /> )
    const button = component.getByText('view')
    fireEvent.click(button)

    const string = 'Testing components can be achieved using react-testing-library by Mehide this/path/takes/you/to/this/blog.html 69 likes like Teh User remove'

    expect(component.container).toHaveTextContent(string)
  })
  test('like button clicked twice calls eventhandler function twice', () => {

    const user = { name: 'Teh User' }
    const blog = {
      title: 'Testing components can be achieved using react-testing-library',
      author: 'Me',
      url: 'this/path/takes/you/to/this/blog.html',
      likes: 69,
      user: user
    }

    const mockHandler = jest.fn()

    const component = render( <Blog blog={ blog } likeBlog={ mockHandler } /> )

    // expand what is shown by clicking view button
    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)

    // click like button twice
    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)

  })

})
