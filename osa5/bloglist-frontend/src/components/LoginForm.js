import React from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
  handleSubmit
}) => {

  const inputStyle = { marginLeft: 5, marginBottom: 5 }
  const btnStyle = { marginBottom: 5 }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={ handleSubmit }>
        <div>
          username
          <input
            id="username"
            style={inputStyle}
            type="text"
            value={ username }
            name="Username"
            onChange={ handleUsernameChange }
          />
        </div>
        <div>
          password
          <input
            id="password"
            style={inputStyle}
            type="password"
            value={ password }
            name="Password"
            onChange={ handlePasswordChange }
          />
        </div>
        <button id="login-button" style={ btnStyle } type="submit">login</button>
      </form>
    </div>
  )

}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm
