import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Tab, Tabs, Modal, Button } from 'react-bootstrap'
import PendientesPago from './PendientesPago'
import Compensados from './Compensados'
import RechazadosPorBanco from './RechazadosPorBanco'
import SolicitudRetorno from './SolicitudRetorno'
import { useSession } from 'react-use-session'
import { useIdleTimer } from 'react-idle-timer'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import '../../../../scss/estilos.scss'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import LotesPago from './LotesPago'

const PagoTransferencia = () => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const [show, setShow] = useState(false)
  const [mensaje, setMensaje] = useState('')
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

  async function Cancelar(opcion) {
    if (opcion == 1) {
      setShow(false)
    } else if (opcion == 2) {
      let idUsuario = 0
      if (session) {
        idUsuario = session.id
      }
      const respuesta = await postSesionUsuario(idUsuario, null, null, '2', session.api_token)
      if (respuesta === 'OK') {
        clear()
        history.push('/')
      }
    }
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
        <Modal responsive variant="primary" show={show} onHide={() => Cancelar(2)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación</Modal.Title>
          </Modal.Header>
          <Modal.Body>{mensaje}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => Cancelar(2)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => Cancelar(1)}>
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="div-content">
          <div style={{ width: '100%' }}>
            <Tabs defaultActiveKey="pendientes" id="uncontrolled-tab-example" className="mb-3">
              <Tab eventKey="pendientes" title="Pendientes">
                <PendientesPago tipo={'TRANSFERENCIA'} />
              </Tab>
              <Tab eventKey="compensados" title="Compensados">
                <Compensados tipo={'TRANSFERENCIA'} />
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
