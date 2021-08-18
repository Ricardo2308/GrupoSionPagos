import PropTypes from 'prop-types'
import React, { Component } from 'react'
import MessageList from './MessageList'
import UserInput from './UserInput'
import Header from './Header'
import { Alert } from 'react-bootstrap'
import { CFormSelect } from '@coreui/react'
import { getUsuarios } from '../../../services/getUsuarios'
import { postMensajes } from '../../../services/postMensajes'

class ChatWindow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      usuarios: [],
      grupos: [],
      id_receptor: '0',
      show: false,
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    this.setState({ id_receptor: event.target.value })
  }

  setShow(valor) {
    this.setState({
      show: valor,
    })
  }

  componentDidMount() {
    getUsuarios(null, null, null, null).then((items) => {
      this.setState({
        usuarios: items.users,
      })
    })
  }

  async onUserInputSubmit(message) {
    if (
      this.props.id_flujo !== '' &&
      this.props.id_usuario !== '' &&
      this.state.id_receptor !== '0'
    ) {
      const respuesta = await postMensajes(
        this.props.id_flujo,
        this.props.id_usuario,
        this.state.id_receptor,
        message.data.text,
        '',
      )
      if (respuesta === 'OK') {
        this.props.onUserInputSubmit(message)
      }
    } else {
      this.setShow(true)
    }
  }

  obtenerChat(receptor) {
    this.props.Receptor(receptor)
  }

  onFilesSelected(filesList) {
    this.props.onFilesSelected(filesList)
  }

  render() {
    let messageList = this.props.messageList || []
    let classList = ['sc-chat-window', this.props.isOpen ? 'opened' : 'closed']
    return (
      <div className={classList.join(' ')}>
        <Header
          teamName={this.props.agentProfile.teamName}
          imageUrl={this.props.agentProfile.imageUrl}
          onClose={this.props.onClose}
        />
        <Alert
          show={this.state.show}
          variant="danger"
          onClose={() => this.setShow(false)}
          dismissible
        >
          <Alert.Heading>Error!</Alert.Heading>
          <p>No has elegido destinatario!</p>
        </Alert>
        <CFormSelect
          onChange={this.handleChange}
          onClick={() => this.obtenerChat(this.state.id_receptor)}
        >
          <option value="0">Seleccione receptor</option>
          {this.state.usuarios.map((item, i) => {
            if (this.props.id_usuario !== item.id) {
              if (item.eliminado !== '1' && item.activo !== '0') {
                return (
                  <option key={item.id} value={item.id}>
                    {item.nombre_usuario}
                  </option>
                )
              }
            }
          })}
        </CFormSelect>
        <MessageList messages={messageList} imageUrl={this.props.agentProfile.imageUrl} />
        <UserInput onSubmit={this.onUserInputSubmit.bind(this)} />
      </div>
    )
  }
}

ChatWindow.propTypes = {
  agentProfile: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onFilesSelected: PropTypes.func,
  onUserInputSubmit: PropTypes.func.isRequired,
}

export default ChatWindow
