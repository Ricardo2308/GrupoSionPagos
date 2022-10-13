import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Tab, Tabs } from 'react-bootstrap'
import { useSession } from 'react-use-session'
import '../../../scss/estilos.scss'
import ConsultorPendientes from './consultorPendientes'
import ConsultorAutorizados from './consultorAutorizados'
import ConsultorRechazados from './consultorRechazados'
import ConsultorCompensados from './consultorCompensados'
import ConsultorCancelados from './consultorCancelados'
import ConsultorRechazadosBanco from './consultorRechazadosBanco'
import ConsultorNoVisados from './consultorNoVisados'
import ConsultorEnviadosBanco from './consultorEnviadosBanco'
import ConsultorPagadosBanco from './consultorPagadosBanco'
import ConsultorReemplazados from './consultorReemplazados'

const ConsultorPagos = (props) => {
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
                <ConsultorPendientes />
              </Tab>
              <Tab eventKey="autorizados" title="Autorizados">
                <ConsultorAutorizados />
              </Tab>
              <Tab eventKey="rechazados" title="Rechazados">
                <ConsultorRechazados />
              </Tab>
              <Tab eventKey="compensados" title="Compensados">
                <ConsultorCompensados />
              </Tab>
              <Tab eventKey="cancelados" title="Cancelados">
                <ConsultorCancelados />
              </Tab>
              <Tab eventKey="noVisados" title="No visados">
                <ConsultorNoVisados />
              </Tab>
              <Tab eventKey="enviadosBanco" title="Enviados a b.">
                <ConsultorEnviadosBanco />
              </Tab>
              <Tab eventKey="pagadosBanco" title="Aceptados por b.">
                <ConsultorPagadosBanco />
              </Tab>
              <Tab eventKey="rechazadosBanco" title="Rechazados por b.">
                <ConsultorRechazadosBanco />
              </Tab>
              <Tab eventKey="reemplazados" title="Reemplazados">
                <ConsultorReemplazados />
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

export default ConsultorPagos
