import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Tab, Tabs, Modal, Button } from 'react-bootstrap'
import PendientesPago from './PendientesPago'
import Compensados from './Compensados'
import RechazadosPorBanco from './RechazadosPorBanco'
import SolicitudRetorno from './SolicitudRetorno'
import EnviadosBanco from './EnviadosBanco'
import AceptadosBanco from './AceptadosBanco'
import { useSession } from 'react-use-session'
import { useIdleTimer } from 'react-idle-timer'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import '../../../../scss/estilos.scss'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import LotesPago from './LotesPago'

const PagoTransferencia = () => {
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
    let MostrarReprocesar = ExistePermiso('Reprocesar')
    let tabSolicitudes
    if (MostrarReprocesar) {
      tabSolicitudes = (
        <Tab eventKey="solicitudretorno" title="Solicitudes a bandeja">
          <SolicitudRetorno tipo={'TRANSFERENCIA'} />
        </Tab>
      )
    }
    return (
      <div className="div-tabs">
        <div className="div-content">
          <div style={{ width: '100%' }}>
            <Tabs defaultActiveKey="pendientes" id="uncontrolled-tab-example" className="mb-3">
              <Tab eventKey="pendientes" title="Pendientes">
                <PendientesPago tipo={'TRANSFERENCIA'} />
              </Tab>
              {/* <Tab eventKey="compensados" title="Compensados">
                <Compensados tipo={'TRANSFERENCIA'} />
              </Tab> */}
              <Tab eventKey="enviadosBanco" title="Enviados a banco">
                <EnviadosBanco tipo={'TRANSFERENCIA'} />
              </Tab>
              <Tab eventKey="aceptadosBanco" title="Aceptados por banco">
                <AceptadosBanco tipo={'TRANSFERENCIA'} />
              </Tab>
              <Tab eventKey="rechazadosBanco" title="Rechazados por banco">
                <RechazadosPorBanco tipo={'TRANSFERENCIA'} />
              </Tab>
              <Tab eventKey="lotespago" title="Lotes de pago">
                <LotesPago tipo={'TRANSFERENCIA'} />
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

export default PagoTransferencia
