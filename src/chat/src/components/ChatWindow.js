import PropTypes from 'prop-types'
import React, { Component } from 'react'
import MessageList from './MessageList'
import UserInput from './UserInput'
import Header from './Header'
import { Alert } from 'react-bootstrap'
import { CFormSelect } from '@coreui/react'
import { postMensajes } from '../../../services/postMensajes'
import { FaPlusSquare } from 'react-icons/fa'

class ChatWindow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      usuarios: props.lista_usuarios,
      grupos: [],
      id_receptor: '0',
      show: false,
    }
    this.handleChange = this.handleChange.bind(this)
    let seEncontro = false
    props.prioridad_usuario.forEach((itemP) => {
      if (seEncontro) {
        return
      }
      let encontrado = props.lista_usuarios.find(
        (item) => itemP.id_usuario_prioridad == item.id_usuario,
      )
      if (encontrado !== undefined) {
        seEncontro = true
        this.state = {
          ...this.state,
          id_receptor: '' + encontrado.id_usuario,
        }
        this.obtenerChat(encontrado.id_usuario)
        return
      }
      return
    })
  }

  handleChange(event) {
    this.obtenerChat(event.target.value)
    this.setState({ id_receptor: event.target.value })
  }

  setShow(valor) {
    this.setState({
      show: valor,
    })
  }

  /* componentDidMount() {
    return false
  } */

  async onUserInputSubmit(message) {
    if (this.props.id_flujo !== '' && this.props.id_usuario !== '' && this.state.id_receptor != 0) {
      const respuesta = await postMensajes(
        this.props.id_flujo,
        this.props.id_usuario,
        this.state.id_receptor,
        message.data.text,
        '',
        this.props.token,
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
        <CFormSelect key={Math.random()} onChange={this.handleChange}>
          <option value="0">Seleccione receptor</option>
          {this.state.usuarios.map((item, i) => {
            let yaEstaSeleccionado = false
            if (item.id_usuario == this.state.id_receptor) {
              yaEstaSeleccionado = true
            }
            if (this.props.id_usuario != item.id_usuario) {
              if (item.nivel == 0) {
                return (
                  <option
                    selected={yaEstaSeleccionado}
                    key={item.id_usuario + 2 * i}
                    value={item.id_usuario}
                  >
                    {item.nombre_usuario}
                    {' => '}
                    {item.perfil}
                  </option>
                )
              }
              if (item.nivel != 0) {
                return (
                  <option
                    selected={yaEstaSeleccionado}
                    key={item.id_usuario + 2 * i}
                    value={item.id_usuario}
                  >
                    {item.nombre_usuario}
                    {' => Autorizador de nivel '}
                    {item.nivel}
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
