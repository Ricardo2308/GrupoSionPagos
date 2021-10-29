import React, { useState } from 'react'
import { Tab, Tabs, Modal, Button } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import FlujoSolicitud from './FlujoSolicitud'
import FlujoOferta from './FlujoOferta'
import FlujoOrden from './FlujoOrden'
import FlujoIngreso from './FlujoIngreso'
import DetalleFlujo from './DetalleFlujo'
import ArchivosFlujo from './ArchivosFlujoF'
import { useSession } from 'react-use-session'
import FlujoFactura from './FlujoFactura'
import FlujoBitacora from './FlujoBitacora'
import { useIdleTimer } from 'react-idle-timer'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import '../../../../scss/estilos.scss'

const CompensacionTabs = () => {
  const history = useHistory()
  const location = useLocation()
  const [time, setTime] = useState(null)
  const [show, setShow] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const { session, clear } = useSession('PendrogonIT-Session')

  function iniciar(minutos) {
    let segundos = 60 * minutos
    const intervalo = setInterval(() => {
      segundos--
      if (segundos == 0) {
        Cancelar(2)
      }
    }, 1000)
    setTime(intervalo)
  }

  function detener() {
    clearInterval(time)
  }

  const handleOnIdle = (event) => {
    setShow(true)
    setMensaje(
      'Ya estuvo mucho tiempo sin realizar ninguna acción. Se cerrará sesión en unos minutos.' +
        ' Si desea continuar presione Aceptar',
    )
    iniciar(2)
    console.log('last active', getLastActiveTime())
  }

  const handleOnActive = (event) => {
    console.log('time remaining', getRemainingTime())
  }

  const handleOnAction = (event) => {}

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * parseInt(session == null ? 1 : session.limiteconexion),
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500,
  })

  async function Cancelar(opcion) {
    if (opcion == 1) {
      setShow(false)
      detener()
    } else if (opcion == 2) {
      let idUsuario = 0
      if (session) {
        idUsuario = session.id
      }
      const respuesta = await postSesionUsuario(idUsuario, null, null, '2')
      if (respuesta === 'OK') {
        clear()
        history.push('/')
      }
      detener()
    }
  }

  if (session) {
    if (location.id_flujo) {
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
              <Tabs defaultActiveKey="solicitud" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="solicitud" title="Solicitud">
                  <FlujoSolicitud id_flujo={location.id_flujo} />
                </Tab>
                <Tab eventKey="oferta" title="Oferta Compra">
                  <FlujoOferta id_flujo={location.id_flujo} />
                </Tab>
                <Tab eventKey="orden" title="Orden Compra">
                  <FlujoOrden id_flujo={location.id_flujo} />
                </Tab>
                <Tab eventKey="ingreso" title="Ingreso Bodega">
                  <FlujoIngreso id_flujo={location.id_flujo} />
                </Tab>
                <Tab eventKey="facturas" title="Facturas">
                  <FlujoFactura id_flujo={location.id_flujo} />
                </Tab>
                <Tab eventKey="detalle" title="Detalle">
                  <DetalleFlujo id_flujo={location.id_flujo} />
                </Tab>
                <Tab eventKey="archivos" title="Archivos">
                  <ArchivosFlujo
                    id_flujo={location.id_flujo}
                    deshabilitar={location.deshabilitar}
                  />
                </Tab>
                <Tab eventKey="bitacora" title="Bitácora">
                  <FlujoBitacora id_flujo={location.id_flujo} />
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      )
    } else {
      history.go(-1)
      return (
        <div className="sin-sesion">
          NO SE CARGÓ EL NÚMERO DE PAGO. REGRESE A LA PANTALLA DE PAGOS.
        </div>
      )
    }
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default CompensacionTabs
