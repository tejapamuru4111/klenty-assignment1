import {Component} from 'react'
import {v4 as uuidv4} from 'uuid'
import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'
import Popup from 'reactjs-popup'

import './index.css'

const quesAns = [
  {
    id: uuidv4(),
    question: 'What is your name ?',
    answers: ['My name is Teja'],
  },
  {
    id: uuidv4(),
    question: 'Define React ?',
    answers: ['React is a framework'],
  },
]

class Home extends Component {
  state = {
    searchVal: '',
    qaList: quesAns,
    inputAns: '',
    newQue: '',
    newQueAns: '',
  }

  onSearchQuestion = event => {
    const searchInput = event.target.value
    this.setState({
      searchVal: searchInput,
    })
  }

  onClickSaveClose = event => {
    const {inputAns, qaList} = this.state
    const updateAns = qaList.map(item => {
      if (item.id === event.target.value) {
        const newItem = {
          id: item.id,
          question: item.question,
          answers: [...item.answers, inputAns],
        }
        return newItem
      }
      return item
    })
    this.setState({qaList: updateAns, inputAns: ''})
  }

  onChangeAns = event => {
    this.setState({
      inputAns: event.target.value,
    })
  }

  onAddQuestion = () => {
    const {newQue, newQueAns} = this.state
    const questionItem = {
      id: uuidv4(),
      question: newQue,
      answers: [newQueAns],
    }

    this.setState(prevState => ({
      qaList: [...prevState.qaList, questionItem],
      newQue: '',
      newQueAns: '',
    }))
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

  render() {
    const {qaList, searchVal} = this.state
    const filteredList = qaList.filter(item =>
      item.question.toLowerCase().includes(searchVal.toLowerCase()),
    )

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
          {filteredList.map(task => (
            <ol key={task.id} id={task.id} className="home-question-card">
              <Popup
                modal
                trigger={
                  <button
                    type="button"
                    className="home-question-button"
                    onClick={this.onClickQuestion}
                  >
                    {task.question}
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
                            value={task.id}
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
              {task.answers.map(ans => (
                <li key={ans} className="home-question-answer">
                  {ans}
                </li>
              ))}
            </ol>
          ))}
          <p className="home-question-card-msg">
            Note :- Tap on the question to answer
          </p>
        </div>

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
      </div>
    )
  }
}

export default Home
