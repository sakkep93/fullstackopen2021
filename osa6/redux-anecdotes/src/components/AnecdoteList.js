import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'

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
  const anecdotes = useSelector(state => state)
  const listStyle = { padding: 0, listStyleType: 'none' }
  return (
    <ul style={ listStyle }>
      { anecdotes.sort((a, b) => b.votes - a.votes).map(anecdote =>
        <Anecdote
          key={ anecdote.id }
          anecdote={ anecdote }
          handleClick={ () => dispatch(voteAnecdote(anecdote.id)) }
        />
      )}
    </ul>
  )
}

export default AnecdoteList
