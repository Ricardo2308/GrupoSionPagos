import React from 'react'
import { useHistory } from 'react-router-dom'
import { Tab, Tabs } from 'react-bootstrap'
import PendientesPago from './PendientesPago'
import Compensados from './Compensados'
import { useSession } from 'react-use-session'
import '../../../../scss/estilos.scss'

const PagoBancario = () => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const comentarios = ['Aprobado', 'Autorización completa']

  if (session) {
    return (
      <div className="div-tabs">
        <div className="div-content">
          <div style={{ width: '100%' }}>
            <Tabs defaultActiveKey="pendientes" id="uncontrolled-tab-example" className="mb-3">
              <Tab eventKey="pendientes" title="Pendientes">
                <PendientesPago tipo={'BANCARIO'} />
              </Tab>
              <Tab eventKey="compensados" title="Compensados">
                <Compensados comentarios={comentarios} tipo={'BANCARIO'} />
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

export default PagoBancario
