
export const setNotification = (message, duration) => {
  return async dispatch => {
    setTimeout(() => {
      dispatch({
        type: 'NOTIFY',
        data: null
      })
    }, duration * 1000)

    dispatch({
      type: 'NOTIFY',
      data: message
    })
  }
}

const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case 'NOTIFY':
      return action.data
    default:
      return state
  }
}

export default notificationReducer
