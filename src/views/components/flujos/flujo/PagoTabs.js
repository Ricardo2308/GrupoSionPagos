import React, { useState } from 'react'
import { CButton } from '@coreui/react'
import { Modal, Tab, Tabs } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { useHistory, useLocation } from 'react-router-dom'
import FlujoSolicitud from './FlujoSolicitud'
import FlujoOferta from './FlujoOferta'
import FlujoOrden from './FlujoOrden'
import FlujoIngreso from './FlujoIngreso'
import DetalleFlujo from './DetalleFlujo'
import ArchivosFlujo from './ArchivosFlujoF'
import { postFlujos } from '../../../../services/postFlujos'
import { postFlujoDetalle } from '../../../../services/postFlujoDetalle'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { postNotificacion } from '../../../../services/postNotificacion'
import { useSession } from 'react-use-session'
import Chat from './Chat'
import FlujoFactura from './FlujoFactura'
import FlujoBitacora from './FlujoBitacora'
import '../../../../scss/estilos.scss'

const PagoTabs = () => {
  const history = useHistory()
  const location = useLocation()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [opcion, setOpcion] = useState(0)
  const [idFlujo, setIdFlujo] = useState(0)

  const handleOnIdle = (event) => {
    setShow(true)
    setOpcion(3)
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

  async function Cancelar(opcion) {
    if (opcion == 3) {
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
    } else {
      setShow(false)
      detener()
    }
  }

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
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    let pagos = []
    pagos.push(id_flujo)
    if (opcion === 1) {
      if (location.estado == 3) {
        const respuesta = await postFlujos(id_flujo, '2', '', '', null)
        const aprobado = await postFlujoDetalle(id_flujo, '4', idUsuario, 'Aprobado', '1')
        if (respuesta == 'OK' && aprobado == 'OK') {
          history.go(-1)
        }
      } else if (location.estado == 4) {
        const respuesta = await postFlujos(id_flujo, location.nivel, '', '', null)
        if (respuesta == 'OK') {
          const aprobado = await postFlujoDetalle(
            id_flujo,
            '4',
            idUsuario,
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
            idUsuario,
            'Autorización completa',
            location.nivel,
          )
          if (finalizado == 'OK') {
            const enviada = await postNotificacion(pagos, idUsuario, 'autorizado por completo.', '')
            if (enviada == 'OK') {
              history.push('/compensacion/' + location.pagina)
            }
          }
        }
      }
    } else if (opcion == 2) {
      const respuesta = await postFlujos(id_flujo, '', '', '1', null)
      const rechazado = await postFlujoDetalle(id_flujo, '6', idUsuario, 'Rechazado', '0')
      if (respuesta == 'OK' && rechazado == 'OK') {
        const enviada = await postNotificacion(pagos, idUsuario, 'rechazado.', '')
        if (enviada == 'OK') {
          history.go(-1)
        }
      }
    } else if (opcion == 3) {
      setShow(true)
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
            <Modal responsive show={show} onHide={() => Cancelar(opcion)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Confirmación</Modal.Title>
              </Modal.Header>
              <Modal.Body>{mensaje}</Modal.Body>
              <Modal.Footer>
                <CButton color="secondary" onClick={() => Cancelar(opcion)}>
                  Cancelar
                </CButton>
                <CButton
                  color="primary"
                  onClick={() => Aprobar_Rechazar(idFlujo, opcion).then(() => Cancelar(1))}
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
                    <FlujoIngreso id_flujo={location.id_flujo} />
                  </Tab>
                  <Tab eventKey="facturas" title="Facturas">
                    <FlujoFactura id_flujo={location.id_flujo} />
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
            <Modal responsive show={show} onHide={() => Cancelar(opcion)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Confirmación</Modal.Title>
              </Modal.Header>
              <Modal.Body>{mensaje}</Modal.Body>
              <Modal.Footer>
                <CButton color="secondary" onClick={() => Cancelar(opcion)}>
                  Cancelar
                </CButton>
                <CButton
                  color="primary"
                  onClick={() => Aprobar_Rechazar(idFlujo, opcion).then(() => Cancelar(1))}
                >
                  Aceptar
                </CButton>
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
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default PagoTabs
