import {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class LoginForm extends Component {
  state = {
    usernameInput: '',
    passwordInput: '',
    showUsernameError: false,
    showPasswordError: false,
    showSubmitError: false,
    errorMsg: '',
  }

  onBlurPassword = () => {
    const isValidPassword = this.validatePassword()

    this.setState({showPasswordError: !isValidPassword})
  }

  onChangePassword = event => {
    this.setState({
      passwordInput: event.target.value,
    })
  }

  renderPasswordField = () => {
    const {passwordInput, showPasswordError} = this.state
    const className = showPasswordError
      ? 'name-input-field error-field'
      : 'name-input-field'

    return (
      <div className="input-container">
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className={className}
          value={passwordInput}
          placeholder="password"
          onChange={this.onChangePassword}
          onBlur={this.onBlurPassword}
        />
      </div>
    )
  }

  onBlurUsername = () => {
    const isValidUsername = this.validateUsername()

    this.setState({showUsernameError: !isValidUsername})
  }

  onChangeUsername = event => {
    this.setState({
      usernameInput: event.target.value,
    })
  }

  renderUserNameField = () => {
    const {usernameInput, showUsernameError} = this.state
    const className = showUsernameError
      ? 'name-input-field error-field'
      : 'name-input-field'

    return (
      <div className="input-container">
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className={className}
          value={usernameInput}
          placeholder="username"
          onChange={this.onChangeUsername}
          onBlur={this.onBlurUsername}
        />
      </div>
    )
  }

  validateUsername = () => {
    const {usernameInput} = this.state

    return usernameInput !== ''
  }

  validatePassword = () => {
    const {passwordInput} = this.state

    return passwordInput.length > 8 && passwordInput !== ''
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('login_token', jwtToken, {
      expires: 30,
    })
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const isValidUsername = this.validateUsername()
    const isValidPassword = this.validatePassword()

    if (isValidUsername && isValidPassword) {
      // fetching to Backend
      const {usernameInput, passwordInput} = this.state
      const userDetails = {
        username: usernameInput,
        password: passwordInput,
      }

      const url = 'http://localhost:3001/login'
      const options = {
        method: 'POST',
        body: JSON.stringify(userDetails),
      }
      const response = await fetch(url, options)
      const data = await response.json()
      if (response.ok === true) {
        this.onSubmitSuccess(data.jwtToken)
      } else {
        this.onSubmitFailure(data.error_msg)
      }
    } else {
      this.setState({
        showUsernameError: !isValidUsername,
        showPasswordError: !isValidPassword,
      })
    }
  }

  renderLoginForm = () => {
    const {showUsernameError, showPasswordError} = this.state

    return (
      <form className="form-container" onSubmit={this.onSubmitForm}>
        {this.renderUserNameField()}
        {showUsernameError && <p className="error-message">Required</p>}
        {this.renderPasswordField()}
        {showPasswordError && <p className="error-message">Required</p>}
        <button type="submit" className="submit-button">
          Login
        </button>
      </form>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const token = Cookies.get('login_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="registration-form-container">
        <h1 className="form-app-title">Wellcome to the App</h1>
        <h1 className="form-title">Login</h1>
        <div className="view-container">
          {this.renderLoginForm()}
          {showSubmitError && (
            <p className="name-input-field error-field">*{errorMsg}</p>
          )}
          <p className="link-to-register">
            Donot have an account ? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    )
  }
}

export default LoginForm
