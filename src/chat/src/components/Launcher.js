import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ChatWindow from './ChatWindow'
import launcherIcon from './../assets/logo-no-bg.svg'
import incomingMessageSound from '../assets/sounds/notification.mp3'
import launcherIconActive from './../assets/close-icon.png'

class Launcher extends Component {
  constructor(props) {
    super(props)
    this.state = {
      launcherIcon,
      isOpen: false,
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.mute) {
      return
    }
    const nextMessage = nextProps.messageList[nextProps.messageList.length - 1]
    const isIncoming = (nextMessage || {}).author === 'them'
    const isNew = nextProps.messageList.length > this.props.messageList.length
    if (isIncoming && isNew) {
      //this.playIncomingMessageSound()
    }
  }

  playIncomingMessageSound() {
    var audio = new Audio(incomingMessageSound)
    audio.play()
  }

  handleClick() {
    if (this.props.handleClick !== undefined) {
      this.props.handleClick()
    } else {
      this.setState({
        isOpen: !this.state.isOpen,
      })
    }
  }

  render() {
    const isOpen = this.props.hasOwnProperty('isOpen') ? this.props.isOpen : this.state.isOpen
    const classList = ['sc-launcher', isOpen ? 'opened' : '']
    return (
      <div id="sc-launcher">
        <div className={classList.join(' ')} onClick={this.handleClick.bind(this)}>
          <MessageCount count={this.props.newMessagesCount} isOpen={isOpen} />
          <img className={'sc-open-icon'} src={launcherIconActive} />
          <img className={'sc-closed-icon'} src={launcherIcon} />
        </div>
        <ChatWindow
          messageList={this.props.messageList}
          onUserInputSubmit={this.props.onMessageWasSent}
          onFilesSelected={this.props.onFilesSelected}
          agentProfile={this.props.agentProfile}
          isOpen={isOpen}
          onClose={this.handleClick.bind(this)}
          id_usuario={this.props.id_usuario}
          id_flujo={this.props.id_flujo}
          Receptor={this.props.Receptor}
          id_grupo={this.props.id_grupo}
          token={this.props.token}
          prioridad_usuario={this.props.prioridad_usuario}
          lista_usuarios={this.props.lista_usuarios}
        />
      </div>
    )
  }
}

const MessageCount = (props) => {
  if (props.count === 0 || props.isOpen === true) {
    return null
  }
  return <div className={'sc-new-messages-count'}>{props.count}</div>
}

Launcher.propTypes = {
  onMessageWasReceived: PropTypes.func,
  onMessageWasSent: PropTypes.func,
  newMessagesCount: PropTypes.number,
  isOpen: PropTypes.bool,
  handleClick: PropTypes.func,
  messageList: PropTypes.arrayOf(PropTypes.object),
  mute: PropTypes.bool,
  children: PropTypes.any,
  onClickOut: PropTypes.func,
}

Launcher.defaultProps = {
  newMessagesCount: 0,
  showEmoji: true,
}

export default Launcher
