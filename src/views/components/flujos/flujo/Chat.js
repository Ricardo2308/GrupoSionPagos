import React, { Component } from 'react'
import { Launcher } from '../../../../chat/src/'
import { Alert } from 'react-bootstrap'
import { getMensajesChat } from '../../../../services/getMensajesChat'
import { getContadorChat } from '../../../../services/getContadorChat'
import { postMensajes } from '../../../../services/postMensajes'
import '../../../../scss/base.css'

class Chat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messageList: [],
      newMessagesCount: 0,
      newCount: 0,
      isOpen: false,
      mensajes: [],
      show: false,
      id_receptor: 0,
    }
    this.obtenerReceptor = this.obtenerReceptor.bind(this)
  }

  componentDidMount() {
    let cont = 0
    getContadorChat(this.props.id_flujo, this.props.id_usuario, this.props.token).then((items) => {
      this.setState({
        mensajes: items.mensajes,
      })
      this.state.mensajes.map((item) => {
        if (item.eliminado == 0) {
          if (item.leido == 0) {
            cont++
          }
        }
      })
      this.setState({
        newMessagesCount: cont,
      })
    })
    const interval = setInterval(() => {
      let cont = 0
      getContadorChat(this.props.id_flujo, this.props.id_usuario, this.props.token).then(
        (items) => {
          this.setState({
            mensajes: items.mensajes,
          })
          this.state.mensajes.map((item) => {
            if (item.eliminado == 0) {
              if (item.leido == 0) {
                cont++
              }
            }
          })
          this.setState({
            newMessagesCount: cont,
          })
        },
      )
    }, 3000)
    return () => clearInterval(interval)
  }

  setShow(valor) {
    this.setState({
      show: valor,
    })
  }

  obtenerReceptor(receptor) {
    this.setState({ messageList: [] })
    this.setState({ newCount: 0 })
    this.setState({ id_receptor: receptor })
    if (receptor != 0) {
      getMensajesChat(this.props.id_flujo, this.props.id_usuario, this.props.token).then(
        (items) => {
          this.setState({
            mensajes: items.mensajes,
          })
          this.state.mensajes.map((item) => {
            if (
              item.id_usuariorecibe == this.props.id_usuario &&
              item.id_usuarioenvia == receptor &&
              item.eliminado == 0
            ) {
              if (item.leido == 0) {
                this.setState({ newCount: this.state.newCount + 1 })
              }
              this._sendMessage(item.mensaje, item.usuarioenvia, item.fecha_hora)
            } else if (
              item.id_usuariorecibe == receptor &&
              item.id_usuarioenvia == this.props.id_usuario &&
              item.eliminado == 0
            ) {
              if (item.leido == 0) {
                this._sendMessageMe(item.mensaje, item.fecha_hora, 'Enviado')
              } else {
                this._sendMessageMe(item.mensaje, item.fecha_hora, 'Leído')
              }
            }
          })
        },
      )
      this.mensajesLeidos(this.props.id_flujo, this.props.id_usuario, receptor, this.props.token)
    }
  }

  _onMessageWasSent(message) {
    this.setState({
      messageList: [...this.state.messageList, message],
    })
  }

  _onFilesSelected(fileList) {
    const objectURL = window.URL.createObjectURL(fileList[0])
    this.setState({
      messageList: [
        ...this.state.messageList,
        {
          type: 'file',
          author: 'me',
          data: {
            url: objectURL,
            fileName: fileList[0].name,
          },
        },
      ],
    })
  }

  _sendMessage(text, autor, fecha) {
    if (text.length > 0) {
      this.setState({
        messageList: [
          ...this.state.messageList,
          {
            author: autor,
            type: 'text',
            fecha: fecha,
            data: { text },
          },
        ],
      })
    }
  }

  _sendMessageMe(text, fecha, estado) {
    if (text.length > 0) {
      this.setState({
        messageList: [
          ...this.state.messageList,
          {
            author: 'me',
            type: 'text',
            fecha: fecha,
            estado: estado,
            data: { text },
          },
        ],
      })
    }
  }

  async mensajesLeidos(pago, emisor, receptor, token) {
    const respuesta = await postMensajes(pago, emisor, receptor, '', '1', token)
    if (respuesta === 'Error') {
      this.setShow(true)
    }
  }

  async _handleClick() {
    this.setState({
      isOpen: !this.state.isOpen,
      newMessagesCount: this.state.newMessagesCount,
    })
  }

  render() {
    return (
      <>
        <div>
          <Alert
            show={this.state.show}
            variant="danger"
            onClose={() => this.setShow(false)}
            dismissible
          >
            <Alert.Heading>Error!</Alert.Heading>
            <p>Error de conexión!</p>
          </Alert>
          <Launcher
            agentProfile={{
              teamName: 'Chat Pago ' + this.props.pago,
            }}
            onMessageWasSent={this._onMessageWasSent.bind(this)}
            onFilesSelected={this._onFilesSelected.bind(this)}
            messageList={this.state.messageList}
            newMessagesCount={this.state.newMessagesCount}
            handleClick={this._handleClick.bind(this)}
            isOpen={this.state.isOpen}
            id_usuario={this.props.id_usuario}
            id_flujo={this.props.id_flujo}
            id_grupo={this.props.id_grupo}
            Receptor={this.obtenerReceptor}
            token={this.props.token}
            prioridad_usuario={this.props.prioridad_usuario}
            lista_usuarios={this.props.lista_usuarios}
          />
        </div>
      </>
    )
  }
}

export default Chat
