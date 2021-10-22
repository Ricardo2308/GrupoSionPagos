import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Tab, Tabs } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import Rechazados from './Rechazados'
import Autorizados from './Autorizados'
import Pendientes from './Pendientes'
import { useSession } from 'react-use-session'
import '../../../../scss/estilos.scss'

const Interna = () => {
  const history = useHistory()
  const [show, setShow] = useState(false)
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')
  const { session } = useSession('PendrogonIT-Session')
  const comentarios = ['Aprobado', 'Autorización completa']
  const comentariosR = ['Rechazado']

  const handleOnIdle = (event) => {
    setShow(true)
    setOpcion(2)
    setMensaje('Ya estuvo mucho tiempo sin realizar ninguna acción. Desea continuar?')
    console.log('last active', getLastActiveTime())
  }

  const handleOnActive = (event) => {
    console.log('time remaining', getRemainingTime())
  }

  const handleOnAction = (event) => {}

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * parseInt(session == null ? 1 : session.limiteconexion),
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500,
  })

  if (session) {
    return (
      <div className="div-tabs">
        <div className="div-content">
          <div style={{ width: '100%' }}>
            <Tabs defaultActiveKey="pendientes" id="uncontrolled-tab-example" className="mb-3">
              <Tab eventKey="pendientes" title="Pendientes">
                <Pendientes tipo={'INTERNA'} />
              </Tab>
              <Tab eventKey="autorizados" title="Autorizados">
                <Autorizados comentarios={comentarios} tipo={'INTERNA'} />
              </Tab>
              <Tab eventKey="rechazados" title="Rechazados">
                <Rechazados comentarios={comentariosR} tipo={'INTERNA'} />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    )
  } else {
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default Interna
