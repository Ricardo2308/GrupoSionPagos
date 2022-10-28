import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Tab, Tabs } from 'react-bootstrap'
import PendientesPago from './PendientesPago'
import Compensados from './Compensados'
import LotesPago from './LotesPago'
import { useSession } from 'react-use-session'
import '../../../../scss/estilos.scss'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'

const PagoBancario = () => {
  const history = useHistory()
  const { session, clear } = useSession('PendrogonIT-Session')
  const [permisos, setPermisos] = useState([])

  useEffect(() => {
    let mounted = true
    let objeto = 'Modulo Compensacion Pagos'
    getPerfilUsuario(session.id, '4', objeto, session.api_token).then((items) => {
      if (mounted) {
        setPermisos(items.detalle)
      }
    })
    return () => (mounted = false)
  }, [])

  function ExistePermiso(permiso) {
    let result = false
    for (let item of permisos) {
      if (permiso == item.descripcion) {
        result = true
      }
    }
    return result
  }

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
                <Compensados tipo={'BANCARIO'} />
              </Tab>
              <Tab eventKey="lotespago" title="Lotes de pago">
                <LotesPago tipo={'BANCARIO'} />
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

export default PagoBancario
