import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Tab, Tabs } from 'react-bootstrap'
import Rechazados from './Rechazados'
import Autorizados from './Autorizados'
import Pendientes from './Pendientes'
import Cancelados from './Cancelados'
import Reemplazos from './Reemplazos'
import { useSession } from 'react-use-session'
import '../../../../scss/estilos.scss'

const Interna = () => {
  const history = useHistory()
  const location = useLocation()
  const { session, clear } = useSession('PendrogonIT-Session')

  if (session) {
    return (
      <div className="div-tabs">
        <div className="div-content">
          <div style={{ width: '100%' }}>
            <Tabs defaultActiveKey="pendientes" id="uncontrolled-tab-example" className="mb-3">
              <Tab eventKey="pendientes" title="Pendientes">
                <Pendientes colorFiltro={location.colorFiltro} tipo={'INTERNA'} />
              </Tab>
              <Tab eventKey="autorizados" title="Autorizados">
                <Autorizados tipo={'INTERNA'} />
              </Tab>
              <Tab eventKey="rechazados" title="Rechazados">
                <Rechazados tipo={'INTERNA'} />
              </Tab>
              <Tab eventKey="cancelados" title="Cancelados">
                <Cancelados tipo={'INTERNA'} />
              </Tab>
              <Tab eventKey="reemplazos" title="Reemplazos">
                <Reemplazos tipo={'INTERNA'} />
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

export default Interna
