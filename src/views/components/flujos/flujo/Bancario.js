import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Tab, Tabs, Modal, Button } from 'react-bootstrap'
import Rechazados from './Rechazados'
import Autorizados from './Autorizados'
import Pendientes from './Pendientes'
import Cancelados from './Cancelados'
import Reemplazos from './Reemplazos'
import { useSession } from 'react-use-session'
import { useIdleTimer } from 'react-idle-timer'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import '../../../../scss/estilos.scss'

const Bancario = (props) => {
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
                <Pendientes colorFiltro={location.colorFiltro} tipo={'BANCARIO'} />
              </Tab>
              <Tab eventKey="autorizados" title="Autorizados">
                <Autorizados tipo={'BANCARIO'} />
              </Tab>
              <Tab eventKey="rechazados" title="Rechazados">
                <Rechazados tipo={'BANCARIO'} />
              </Tab>
              <Tab eventKey="cancelados" title="Cancelados">
                <Cancelados tipo={'BANCARIO'} />
              </Tab>
              <Tab eventKey="reemplazos" title="Reemplazos">
                <Reemplazos tipo={'BANCARIO'} />
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

export default Bancario
