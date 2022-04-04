import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Tab, Tabs, Modal, Button } from 'react-bootstrap'
import Rechazados from './Rechazados'
import Autorizados from './Autorizados'
import Pendientes from './Pendientes'
import Cancelados from './Cancelados'
import { useSession } from 'react-use-session'
import { useIdleTimer } from 'react-idle-timer'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import '../../../../scss/estilos.scss'

const Transferencia = () => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [show, setShow] = useState(false)
  const { session, clear } = useSession('PendrogonIT-Session')

  async function Cancelar(opcion) {
    if (opcion == 1) {
      setShow(false)
    } else if (opcion == 2) {
      let idUsuario = 0
      if (session) {
        idUsuario = session.id
      }
      const respuesta = await postSesionUsuario(idUsuario, null, null, '2')
      if (respuesta === 'OK') {
        clear()
        history.push('/')
      }
    }
  }

  if (session) {
    return (
      <div className="div-tabs">
        <Modal responsive variant="primary" show={show} onHide={() => Cancelar(2)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación</Modal.Title>
          </Modal.Header>
          <Modal.Body>{mensaje}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => Cancelar(2)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => Cancelar(1)}>
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="div-content">
          <div style={{ width: '100%' }}>
            <Tabs defaultActiveKey="pendientes" id="uncontrolled-tab-example" className="mb-3">
              <Tab eventKey="pendientes" title="Pendientes">
                <Pendientes tipo={'TRANSFERENCIA'} />
              </Tab>
              <Tab eventKey="autorizados" title="Autorizados">
                <Autorizados tipo={'TRANSFERENCIA'} />
              </Tab>
              <Tab eventKey="rechazados" title="Rechazados">
                <Rechazados tipo={'TRANSFERENCIA'} />
              </Tab>
              <Tab eventKey="cancelados" title="Cancelados">
                <Cancelados tipo={'INTERNA'} />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    )
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default Transferencia
