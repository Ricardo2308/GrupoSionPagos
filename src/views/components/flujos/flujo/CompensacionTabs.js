import React, { useState } from 'react'
import { CButton } from '@coreui/react'
import { Modal, Tab, Tabs } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import FlujoSolicitud from './FlujoSolicitud'
import FlujoOferta from './FlujoOferta'
import FlujoOrden from './FlujoOrden'
import FlujoIngreso from './FlujoIngreso'
import DetalleFlujo from './DetalleFlujo'
import ArchivosFlujo from './ArchivosFlujoF'
import { postFlujos } from '../../../../services/postFlujos'
import { useSession } from 'react-use-session'
import '../../../../scss/estilos.scss'
import FlujoFactura from './FlujoFactura'
import FlujoBitacora from './FlujoBitacora'

const PagoTabs = () => {
  const history = useHistory()
  const location = useLocation()
  const { session } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [idFlujo, setIdFlujo] = useState(0)

  const handleClose = () => setShow(false)

  function mostrarModal(id_flujo) {
    setIdFlujo(id_flujo)
    setShow(true)
  }

  async function rechazarPago(id_flujo) {
    const respuesta = await postFlujos(id_flujo)
    if (respuesta === 'OK') {
      history.go(-1)
    }
  }

  if (session) {
    if (location.id_flujo) {
      return (
        <div className="div-tabs">
          <Modal responsive variant="primary" show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>Confirmación</Modal.Title>
            </Modal.Header>
            <Modal.Body>Está seguro de rechazar el pago?</Modal.Body>
            <Modal.Footer>
              <CButton color="secondary" onClick={handleClose}>
                Cancelar
              </CButton>
              <CButton color="primary" onClick={() => rechazarPago(idFlujo).then(handleClose)}>
                Aceptar
              </CButton>
            </Modal.Footer>
          </Modal>
          <div className="float-right" style={{ marginTop: '15px', marginRight: '15px' }}>
            <CButton color="success" size="sm" onClick={() => history.go(-1)}>
              Aceptar
            </CButton>{' '}
            <CButton color="danger" size="sm" onClick={() => mostrarModal(location.id_flujo)}>
              Rechazar
            </CButton>
          </div>
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
