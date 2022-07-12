import PropTypes from 'prop-types'
import React, { Component } from 'react'
import SendIcon from './icons/SendIcon'

class UserInput extends Component {
  constructor() {
    super()
    this.state = {
      inputActive: false,
      inputHasText: false,
    }
  }

  handleKeyDown(event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      return this._submitText(event)
    }
  }

  handleKeyUp(event) {
    const inputHasText = event.target.innerHTML.length !== 0 && event.target.innerText !== '\n'
    this.setState({ inputHasText })
  }

  _showFilePicker() {
    this._fileUploadButton.click()
  }

  _submitText(event) {
    event.preventDefault()
    const text = this.userInput.textContent
    if (text && text.length > 0) {
      this.props.onSubmit({
        author: 'me',
        type: 'text',
        data: { text },
      })
      this.userInput.innerHTML = ''
    }
  }

  _onFilesSelected(event) {
    if (event.target.files && event.target.files.length > 0) {
      this.props.onFilesSelected(event.target.files)
    }
  }

  _renderSendOrFileIcon() {
    if (this.state.inputHasText) {
      return (
        <div className="sc-user-input--button">
          <SendIcon onClick={this._submitText.bind(this)} />
        </div>
      )
    }
  }

  render() {
    const { inputActive } = this.state
    return (
      <form className={`sc-user-input ${inputActive ? 'active' : ''}`}>
        <div
          role="button"
          tabIndex="0"
          onFocus={() => {
            this.setState({ inputActive: true })
          }}
          onBlur={() => {
            this.setState({ inputActive: false })
          }}
          ref={(e) => {
            this.userInput = e
          }}
          onKeyDown={this.handleKeyDown.bind(this)}
          onKeyUp={this.handleKeyUp.bind(this)}
          contentEditable="true"
          placeholder="Escriba una respuesta"
          className="sc-user-input--text"
        ></div>
        <div className="sc-user-input--buttons">
          <div className="sc-user-input--button"></div>
          <div className="sc-user-input--button"></div>
          {this._renderSendOrFileIcon()}
        </div>
      </form>
    )
  }
}

UserInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onFilesSelected: PropTypes.func.isRequired,
}

export default UserInput
