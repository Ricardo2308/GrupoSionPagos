import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Tab, Tabs } from 'react-bootstrap'
import Rechazados from './Rechazados'
import Autorizados from './Autorizados'
import Pendientes from './Pendientes'
import { useSession } from 'react-use-session'
import '../../../../scss/estilos.scss'

const Interna = () => {
  const history = useHistory()
  const location = useLocation()
  const { session } = useSession('PendrogonIT-Session')

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
                <Autorizados tipo={'INTERNA'} />
              </Tab>
              <Tab eventKey="rechazados" title="Rechazados">
                <Rechazados tipo={'INTERNA'} />
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