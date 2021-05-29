export const showNotification = (content) => {
  return { type: 'SHOW', content }
}

export const removeNotification = () => {
  return { type: 'REMOVE', content: null }
}

const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case 'SHOW':
      return action.content
    case 'REMOVE':
      return null
    default:
      return null
  }
}

export default notificationReducer
