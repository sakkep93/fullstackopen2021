let timeoutID = null

export const setNotification = (message, duration) => {
  return async dispatch => {

    // show notification
    dispatch({ type: 'NOTIFY', data: message })
    clearTimeout(timeoutID)

    // hide
    timeoutID = setTimeout(() => {
      dispatch({
        type: 'NOTIFY',
        data: null
      })
    }, duration * 1000)
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
