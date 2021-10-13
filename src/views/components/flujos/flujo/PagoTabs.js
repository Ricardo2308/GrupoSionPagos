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
import { postFlujoDetalle } from '../../../../services/postFlujoDetalle'
import { postNotificacion } from '../../../../services/postNotificacion'
import { useSession } from 'react-use-session'
import Chat from './Chat'
import '../../../../scss/estilos.scss'
import FlujoFactura from './FlujoFactura'
import FlujoBitacora from './FlujoBitacora'

const PagoTabs = () => {
  const history = useHistory()
  const location = useLocation()
  const { session } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [opcion, setOpcion] = useState(0)
  const [idFlujo, setIdFlujo] = useState(0)

  const handleClose = () => setShow(false)

  function mostrarModal(id_flujo, opcion) {
    if (opcion == 1) {
      setIdFlujo(id_flujo)
      setOpcion(opcion)
      setMensaje('Está seguro de aprobar el pago?')
      setShow(true)
    } else if (opcion == 2) {
      setIdFlujo(id_flujo)
      setOpcion(opcion)
      setMensaje('Está seguro de rechazar el pago?')
      setShow(true)
    }
  }

  async function Aprobar_Rechazar(id_flujo, opcion) {
    let pagos = []
    pagos.push(id_flujo)
    if (opcion === 1) {
      if (location.estado == 3) {
        const respuesta = await postFlujos(id_flujo, '2', '', '', null)
        const aprobado = await postFlujoDetalle(id_flujo, '4', session.id, 'Aprobado', '1')
        if (respuesta == 'OK' && aprobado == 'OK') {
          history.go(-1)
        }
      } else if (location.estado == 4) {
        const respuesta = await postFlujos(id_flujo, location.nivel, '', '', null)
        if (respuesta == 'OK') {
          const aprobado = await postFlujoDetalle(
            id_flujo,
            '4',
            session.id,
            'Aprobado',
            location.nivel,
          )
          if (aprobado == 'OK') {
            history.go(-1)
          }
        } else if (respuesta == 'Finalizado') {
          const finalizado = await postFlujoDetalle(
            id_flujo,
            '5',
            session.id,
            'Autorización completa',
            location.nivel,
          )
          if (finalizado == 'OK') {
            const enviada = await postNotificacion(
              pagos,
              session.id,
              'autorizado por completo.',
              '',
            )
            if (enviada == 'OK') {
              history.push('/compensacion/' + location.pagina)
            }
          }
        }
      }
    } else if (opcion == 2) {
      const respuesta = await postFlujos(id_flujo, '', '', '1', null)
      const rechazado = await postFlujoDetalle(id_flujo, '6', session.id, 'Rechazado', '0')
      if (respuesta == 'OK' && rechazado == 'OK') {
        const enviada = await postNotificacion(pagos, session.id, 'rechazado.', '')
        if (enviada == 'OK') {
          history.go(-1)
        }
      }
    }
  }

  if (session) {
    if (location.id_flujo) {
      let grupo = 0
      let nivel = 0
      if (location.id_grupo) {
        grupo = location.id_grupo
      }
      if (location.estado > 2 && location.estado < 5) {
        return (
          <div className="div-tabs">
            <Modal responsive variant="primary" show={show} onHide={handleClose} centered>
              <Modal.Header closeButton>
                <Modal.Title>Confirmación</Modal.Title>
              </Modal.Header>
              <Modal.Body>{mensaje}</Modal.Body>
              <Modal.Footer>
                <CButton color="secondary" onClick={handleClose}>
                  Cancelar
                </CButton>
                <CButton
                  color="primary"
                  onClick={() => Aprobar_Rechazar(idFlujo, opcion).then(handleClose)}
                >
                  Aceptar
                </CButton>
              </Modal.Footer>
            </Modal>
            <div className="float-right" style={{ marginTop: '15px', marginRight: '15px' }}>
              <CButton color="success" size="sm" onClick={() => mostrarModal(location.id_flujo, 1)}>
                Aprobar
              </CButton>{' '}
              <CButton color="danger" size="sm" onClick={() => mostrarModal(location.id_flujo, 2)}>
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
                    <FlujoIngreso id_flujo1={location.id_flujo} />
                  </Tab>
                  <Tab eventKey="facturas" title="Facturas">
                    <FlujoFactura id_flujo1={location.id_flujo} />
                  </Tab>
                  <Tab eventKey="detalle" title="Detalle">
                    <DetalleFlujo id_flujo={location.id_flujo} />
                  </Tab>
                  <Tab eventKey="archivos" title="Archivos">
                    <ArchivosFlujo id_flujo={location.id_flujo} estado={location.estado} />
                  </Tab>
                  <Tab eventKey="bitacora" title="Bitácora">
                    <FlujoBitacora id_flujo={location.id_flujo} />
                  </Tab>
                </Tabs>
              </div>
            </div>
            <Chat
              id_usuario={session.id}
              id_flujo={location.id_flujo}
              pago={location.pago}
              id_grupo={grupo}
              nivel={nivel}
              estado={location.estado}
            />
          </div>
        )
      } else {
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
                    <FlujoIngreso id_flujo1={location.id_flujo} />
                  </Tab>
                  <Tab eventKey="facturas" title="Facturas">
                    <FlujoFactura id_flujo1={location.id_flujo} />
                  </Tab>
                  <Tab eventKey="detalle" title="Detalle">
                    <DetalleFlujo id_flujo={location.id_flujo} />
                  </Tab>
                  <Tab eventKey="archivos" title="Archivos">
                    <ArchivosFlujo id_flujo={location.id_flujo} estado={location.estado} />
                  </Tab>
                  <Tab eventKey="bitacora" title="Bitácora">
                    <FlujoBitacora id_flujo={location.id_flujo} />
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        )
      }
    } else {
      history.push('/dashboard')
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
