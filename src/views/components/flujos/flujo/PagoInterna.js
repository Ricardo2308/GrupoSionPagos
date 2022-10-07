import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useIdleTimer } from 'react-idle-timer'
import { Tab, Tabs, Modal, Button } from 'react-bootstrap'
import PendientesPago from './PendientesPago'
import Compensados from './Compensados'
import RechazadosPorBanco from './RechazadosPorBanco'
import SolicitudRetorno from './SolicitudRetorno'
import { useSession } from 'react-use-session'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import '../../../../scss/estilos.scss'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import LotesPago from './LotesPago'

const PagoInterna = () => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const [show, setShow] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const { session, clear } = useSession('PendrogonIT-Session')
  const comentarios = ['Compensado']
  const [permisos, setPermisos] = useState([])
  const [desactivarBotonModal, setDesactivarBotonModal] = useState(false)

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
    let MostrarReprocesar = ExistePermiso('Reprocesar')
    let tabSolicitudes
    if (MostrarReprocesar) {
      tabSolicitudes = (
        <Tab eventKey="solicitudretorno" title="Solicitudes a bandeja">
          <SolicitudRetorno tipo={'INTERNA'} />
        </Tab>
      )
    }
    return (
      <div className="div-tabs">
        <div className="div-content">
          <div style={{ width: '100%' }}>
            <Tabs defaultActiveKey="pendientes" id="uncontrolled-tab-example" className="mb-3">
              <Tab eventKey="pendientes" title="Pendientes">
                <PendientesPago tipo={'INTERNA'} />
              </Tab>
              <Tab eventKey="compensados" title="Compensados">
                <Compensados tipo={'INTERNA'} />
              </Tab>
              <Tab eventKey="rechazadosBanco" title="Rechazados por banco">
                <RechazadosPorBanco comentarios={comentarios} tipo={'INTERNA'} />
              </Tab>
              <Tab eventKey="lotespago" title="Lotes de pago">
                <LotesPago tipo={'INTERNA'} />
              </Tab>
              {tabSolicitudes}
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

export default PagoInterna
