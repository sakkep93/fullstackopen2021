import React from 'react'

const Notification = ({ message, messageType }) => {
    if (message === null) return null

    const color = messageType === 'success' ? 'green' : 'red';
    const style = {
        color: color,
        background: 'lightgrey',
        fontSize: '20px',
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px'
    }

    return (
        <div style={style}> {message} </div>
    )
}

export default Notification
