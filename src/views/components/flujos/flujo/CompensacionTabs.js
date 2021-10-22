import React, { useState } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import { useIdleTimer } from 'react-idle-timer'
import FlujoSolicitud from './FlujoSolicitud'
import FlujoOferta from './FlujoOferta'
import FlujoOrden from './FlujoOrden'
import FlujoIngreso from './FlujoIngreso'
import DetalleFlujo from './DetalleFlujo'
import ArchivosFlujo from './ArchivosFlujoF'
import { useSession } from 'react-use-session'
import '../../../../scss/estilos.scss'
import FlujoFactura from './FlujoFactura'
import FlujoBitacora from './FlujoBitacora'

const PagoTabs = () => {
  const history = useHistory()
  const location = useLocation()
  const [show, setShow] = useState(false)
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')
  const { session } = useSession('PendrogonIT-Session')

  const handleOnIdle = (event) => {
    setShow(true)
    setOpcion(2)
    setMensaje('Ya estuvo mucho tiempo sin realizar ninguna acción. Desea continuar?')
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

  if (session) {
    if (location.id_flujo) {
      return (
        <div className="div-tabs">
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
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default PagoTabs
