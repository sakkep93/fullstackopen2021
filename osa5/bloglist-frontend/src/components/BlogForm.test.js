import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {

  test('calls eventhandler function with correct data when a blog is created', () => {

    const mockHandler = jest.fn()
    const component = render( <BlogForm createBlog={ mockHandler }/> )

    const titleInput = component.container.querySelector('#blogTitle')
    const authorInput = component.container.querySelector('#blogAuthor')
    const urlInput = component.container.querySelector('#blogUrl')

    const form = component.container.querySelector('form')

    fireEvent.change(titleInput, { target: { value: 'You' } })
    fireEvent.change(authorInput, { target: { value: 'Tube' } })
    fireEvent.change(urlInput, { target: { value: 'www.youtube.com' } })

    fireEvent.submit(form)

    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.calls[0][0].title).toBe('You')
    expect(mockHandler.mock.calls[0][0].author).toBe('Tube')
    expect(mockHandler.mock.calls[0][0].url).toBe('www.youtube.com')
  })

})
