import {Component} from 'react'
import {Link} from 'react-router-dom'
import {v4 as uuidv4} from 'uuid'

import './index.css'

class RegistrationForm extends Component {
  state = {
    firstNameInput: '',
    lastNameInput: '',
    usernameInput: '',
    passwordInput: '',
    genderInput: '',
    showUsernameError: false,
    showPasswordError: false,
    showGenderError: false,
    showFirstNameError: false,
    showLastNameError: false,
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeGender = event => {
    this.setState({
      genderInput: event.target.value,
    })
  }

  renderGenderField = () => {
    const {showGenderError} = this.state
    const className = showGenderError
      ? 'name-input-field error-field'
      : 'name-input-field'

    return (
      <div className="input-container">
        <label className="input-label" htmlFor="gender">
          GENDER
        </label>
        <div className="gender-field-card">
          <input
            type="radio"
            id="male"
            name="gender"
            value="Male"
            className={className}
            onChange={this.onChangeGender}
          />
          <label htmlFor="male" className="input-label">
            Male
          </label>
        </div>
        <div className="gender-field-card">
          <input
            type="radio"
            id="female"
            name="gender"
            value="Female"
            className={className}
            onChange={this.onChangeGender}
          />
          <label htmlFor="female" className="input-label">
            Female
          </label>
        </div>
      </div>
    )
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

  onBlurLastName = () => {
    const isValidLastName = this.validateLastName()

    this.setState({showLastNameError: !isValidLastName})
  }

  onChangeLastName = event => {
    const {target} = event
    const {value} = target

    this.setState({
      lastNameInput: value,
    })
  }

  renderLastNameField = () => {
    const {lastNameInput, showLastNameError} = this.state
    const className = showLastNameError
      ? 'name-input-field error-field'
      : 'name-input-field'

    return (
      <div className="input-container">
        <label className="input-label" htmlFor="lastName">
          LAST NAME
        </label>
        <input
          type="text"
          id="lastName"
          className={className}
          value={lastNameInput}
          placeholder="Last name"
          onChange={this.onChangeLastName}
          onBlur={this.onBlurLastName}
        />
      </div>
    )
  }

  onBlurFirstName = () => {
    const isValidFirstName = this.validateFirstName()

    this.setState({showFirstNameError: !isValidFirstName})
  }

  onChangeFirstName = event => {
    const {target} = event
    const {value} = target

    this.setState({
      firstNameInput: value,
    })
  }

  renderFirstNameField = () => {
    const {firstNameInput, showFirstNameError} = this.state
    const className = showFirstNameError
      ? 'name-input-field error-field'
      : 'name-input-field'

    return (
      <div className="input-container">
        <label className="input-label" htmlFor="firstName">
          FIRST NAME
        </label>
        <input
          type="text"
          id="firstName"
          className={className}
          value={firstNameInput}
          placeholder="First name"
          onChange={this.onChangeFirstName}
          onBlur={this.onBlurFirstName}
        />
      </div>
    )
  }

  validateLastName = () => {
    const {lastNameInput} = this.state

    return lastNameInput !== ''
  }

  validateFirstName = () => {
    const {firstNameInput} = this.state

    return firstNameInput !== ''
  }

  validateUsername = () => {
    const {usernameInput} = this.state

    return usernameInput !== ''
  }

  validatePassword = () => {
    const {passwordInput} = this.state

    return passwordInput.length > 8 && passwordInput !== ''
  }

  validateGender = () => {
    const {genderInput} = this.state

    return genderInput !== ''
  }

  onSubmitSuccess = () => {
    const {history} = this.props

    history.replace('login')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const isValidFirstName = this.validateFirstName()
    const isValidLastName = this.validateLastName()
    const isValidUsername = this.validateUsername()
    const isValidPassword = this.validatePassword()
    const isValidGender = this.validateGender()

    if (
      isValidFirstName &&
      isValidLastName &&
      isValidUsername &&
      isValidPassword &&
      isValidGender
    ) {
      // fetching to Backend
      const {
        usernameInput,
        passwordInput,
        firstNameInput,
        lastNameInput,
        genderInput,
      } = this.state

      const userDetails = {
        id: uuidv4(),
        username: usernameInput,
        password: passwordInput,
        firstname: firstNameInput,
        lastname: lastNameInput,
        gender: genderInput,
      }

      const url = 'http://localhost:3001/register'
      const options = {
        method: 'POST',
        body: JSON.stringify(userDetails),
      }
      const response = await fetch(url, options)
      const data = await response.json()
      if (response.ok === true) {
        this.onSubmitSuccess()
      } else {
        this.onSubmitFailure(data.error_msg)
      }
    } else {
      this.setState({
        showFirstNameError: !isValidFirstName,
        showLastNameError: !isValidLastName,
        showUsernameError: !isValidUsername,
        showPasswordError: !isValidPassword,
        showGenderError: !isValidGender,
      })
    }
  }

  renderRegistrationForm = () => {
    const {
      showFirstNameError,
      showLastNameError,
      showUsernameError,
      showPasswordError,
      showGenderError,
    } = this.state

    return (
      <form className="form-container" onSubmit={this.onSubmitForm}>
        {this.renderFirstNameField()}
        {showFirstNameError && <p className="error-message">Required</p>}
        {this.renderLastNameField()}
        {showLastNameError && <p className="error-message">Required</p>}
        {this.renderUserNameField()}
        {showUsernameError && <p className="error-message">Required</p>}
        {this.renderPasswordField()}
        {showPasswordError && <p className="error-message">Required</p>}
        {this.renderGenderField()}
        {showGenderError && <p className="error-message">Required</p>}
        <button type="submit" className="submit-button">
          Register
        </button>
      </form>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    return (
      <div className="registration-form-container">
        <h1 className="form-app-title">Wellcome to the App</h1>
        <h1 className="form-title">Registration</h1>
        <div className="view-container">
          {this.renderRegistrationForm()}
          {showSubmitError && (
            <p className="name-input-field error-field">*{errorMsg}</p>
          )}
          <p className="link-to-register">
            Already have an account ? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    )
  }
}

export default RegistrationForm
