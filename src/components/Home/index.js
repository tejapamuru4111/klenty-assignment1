import {Component} from 'react'
import {v4 as uuidv4} from 'uuid'
import {Redirect} from 'react-router-dom'
import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'
import Popup from 'reactjs-popup'

import './index.css'

const apiConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    apiStatus: apiConstants.initial,
    searchVal: '',
    qaList: [],
    inputAns: '',
    newQue: '',
    newQueAns: '',
  }

  componentDidMount() {
    this.getQuestionAndAnswers()
  }

  getQuestionAndAnswers = async () => {
    this.setState({apiStatus: apiConstants.loading})
    const {searchVal} = this.state
    const url = `http://localhost:3001/?search=${searchVal}`
    const options = {
      method: 'GET',
    }

    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      this.setState({qaList: data, apiStatus: apiConstants.success})
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  onSearchQuestion = event => {
    const searchInput = event.target.value
    this.setState({
      searchVal: searchInput,
    })
  }

  onClickSaveClose = event => {
    const {inputAns} = this.state
    const jwtToken = Cookies.get('login_token')
    // fetching post method for question and answer
    const questionDetails = {
      f_id: event.target.value,
      ans: inputAns,
    }
    const url = 'http://localhost:3001/'
    const options = {
      method: 'POST',
      body: JSON.stringify(questionDetails),
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = fetch(url, options)
    if (response.ok) {
      this.setState({inputAns: ''}, this.getQuestionAndAnswers())
    }
  }

  onChangeAns = event => {
    this.setState({
      inputAns: event.target.value,
    })
  }

  onAddQuestion = () => {
    const {newQue, newQueAns} = this.state
    const jwtToken = Cookies.get('login_token')
    // fetching post method for question and answer
    const uid = uuidv4()
    const questionDetails = {
      f_id: uid,
      que: newQue,
      ans: newQueAns,
    }
    const url = 'http://localhost:3001/'
    const options = {
      method: 'POST',
      body: JSON.stringify(questionDetails),
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = fetch(url, options)
    if (response.ok) {
      this.setState({newQue: '', newQueAns: ''}, this.getQuestionAndAnswers())
    }
  }

  onChangeQue = event => {
    this.setState({newQue: event.target.value})
  }

  onChangeNewQueAns = event => {
    this.setState({newQueAns: event.target.value})
  }

  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('login_token')
    history.replace('/login')
  }

  renderHomePage = () => {
    const {qaList} = this.state
    return (
      <div className="home-questions-container">
        {qaList.map(task => (
          <ol
            key={task.faqId}
            value={task.faqId}
            className="home-question-card"
          >
            <h1 className="home-question">{task.question}</h1>
            {task.answers.map(ans => (
              <li key={ans.ans_id} className="home-question-answer">
                {ans.answer}
              </li>
            ))}
            <Popup
              modal
              trigger={
                <button
                  className="add-answer-button"
                  type="button"
                  onClick={this.onClickAddAnswer}
                >
                  Add Answer
                </button>
              }
            >
              {close => {
                const {inputAns} = this.state
                return (
                  <>
                    <div className="popup-container">
                      <textarea
                        cols={50}
                        rows={10}
                        onChange={this.onChangeAns}
                        value={inputAns}
                        className="answer-text-field"
                        placeholder="Type your answer"
                      />
                      <div>
                        <button
                          type="button"
                          className="popup-button"
                          value={task.faqId}
                          onClick={this.onClickSaveClose}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="popup-button"
                          onClick={() => close()}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </>
                )
              }}
            </Popup>
          </ol>
        ))}
        <p className="home-question-card-msg">
          Note :- Click on the add answer button to answer
        </p>
      </div>
    )
  }

  renderAddNewQuestion = () => (
    <>
      <Popup
        modal
        trigger={
          <button
            type="button"
            className="add-question-button"
            onClick={this.onAddQuestion}
          >
            Add Question
          </button>
        }
      >
        {close => {
          const {newQue, newQueAns} = this.state

          return (
            <>
              <div className="popup-container">
                <input
                  type="text"
                  value={newQue}
                  onChange={this.onChangeQue}
                  className="home-question-input"
                  placeholder="Type your Question"
                />
                <textarea
                  cols={50}
                  rows={10}
                  value={newQueAns}
                  onChange={this.onChangeNewQueAns}
                  className="answer-text-field"
                  placeholder="Type your answer"
                />
                <div>
                  <button
                    className="popup-button"
                    type="button"
                    onClick={this.onAddQuestion}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="popup-button"
                    onClick={() => close()}
                  >
                    Close
                  </button>
                </div>
              </div>
            </>
          )
        }}
      </Popup>
    </>
  )

  renderLoader = () => (
    <>
      <div data-testid="loader">
        <Loader type="ThreeDots" color="#222222" height="50" width="50" />
      </div>
    </>
  )

  onRetry = () => {
    this.getQuestionAndAnswers()
  }

  renderFailureView = () => (
    <>
      <p>Something went wrong Try again.</p>
      <button
        type="button"
        className="home-retry-button"
        onClick={this.onRetry}
      >
        Retry
      </button>
    </>
  )

  renderAllFunctions = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.renderHomePage()
      case apiConstants.loading:
        return this.renderLoader()
      case apiConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {searchVal} = this.state

    const token = Cookies.get('login_token')
    if (token === undefined) {
      return <Redirect to="/login" />
    }

    return (
      <div className="home-bg-container">
        <h1 className="home-card-heading">
          Post your Questions /
          <br /> Answer the existing One
        </h1>
        <div className="home-header-card">
          <input
            type="search"
            value={searchVal}
            onChange={this.onSearchQuestion}
            className="home-search-input"
            placeholder="Search Question"
          />
          <button
            type="button"
            className="home-logout-button"
            onClick={this.onClickLogout}
          >
            Logout
          </button>
        </div>
        <div className="home-questions-container">
          {this.renderAllFunctions()}
        </div>
        {this.renderAddNewQuestion()}
      </div>
    )
  }
}

export default Home
