import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { showNotification, removeNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  const listItemStyle = { marginBottom: 5 }
  return (
    <li style={ listItemStyle }>
      <div>{ anecdote.content }</div>
      <div>
        has { anecdote.votes }
        <button onClick={ handleClick }>vote</button>
      </div>
    </li>
  )
}

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const vote = (id) => { dispatch(voteAnecdote(id)) }
  const notify = (content) => {
    dispatch(showNotification(`you voted '${content}'`))
    setTimeout(() => { dispatch(removeNotification()) }, 5000)
  }
  const handleClick = (anecdote) => {
    vote(anecdote.id)
    notify(anecdote.content)
  }
  const anecdotes = useSelector(state => state.anecdotes.filter(a => a.content.toLowerCase().includes(state.filter.toLowerCase())))
  const listStyle = { padding: 0, listStyleType: 'none' }
  return (
    <ul style={ listStyle }>
      { anecdotes.sort((a, b) => b.votes - a.votes).map(anecdote =>
        <Anecdote
          key={ anecdote.id }
          anecdote={ anecdote }
          handleClick={ () => handleClick(anecdote) }
        />
      )}
    </ul>
  )
}

export default AnecdoteList
