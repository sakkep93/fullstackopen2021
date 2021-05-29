import React from 'react'
import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { showNotification, removeNotification } from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {
  const dispatch = useDispatch()
  const notify = (content) => {
    dispatch(showNotification(`you added '${content}'`))
    setTimeout(() => { dispatch(removeNotification()) }, 5000)
  }
  const addAnecdote = (content) => { dispatch(createAnecdote(content)) }
  const handleOnSubmit = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    addAnecdote(content)
    notify(content)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={ handleOnSubmit }>
        <div><input name="anecdote"/></div>
        <button>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
