import React from 'react'
import { useHistory } from 'react-router-dom'
import { Tab, Tabs } from 'react-bootstrap'
import Conectados from './Conectados'
import General from './General'
import { useSession } from 'react-use-session'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import '../../../../scss/estilos.scss'

const TabSesiones = () => {
  const history = useHistory()
  const { session, clear } = useSession('PendrogonIT-Session')

  if (session) {
    return (
      <div className="div-tabs">
        <div className="div-content">
          <div style={{ width: '100%' }}>
            <Tabs defaultActiveKey="Conectados" id="uncontrolled-tab-example" className="mb-3">
              <Tab eventKey="Conectados" title="Conectados">
                <Conectados />
              </Tab>
              <Tab eventKey="General" title="General">
                <General tipo={'General'} />
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

export default TabSesiones
