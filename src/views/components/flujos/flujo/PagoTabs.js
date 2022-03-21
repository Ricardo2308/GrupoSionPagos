import React, { useState, useEffect } from 'react'
import { CButton } from '@coreui/react'
import { Modal, Tab, Tabs, Button } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import FlujoSolicitud from './FlujoSolicitud'
import FlujoOferta from './FlujoOferta'
import FlujoOrden from './FlujoOrden'
import FlujoIngreso from './FlujoIngreso'
import DetalleFlujo from './DetalleFlujo'
import FlujoFacturaCantidad from './FlujoFacturaCantidad'
import FlujoFacturaDocumento from './FlujoFacturaDocumento'
import ArchivosFlujo from './ArchivosFlujoF'
import { postFlujos } from '../../../../services/postFlujos'
import { postFlujoDetalle } from '../../../../services/postFlujoDetalle'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { postNotificacion } from '../../../../services/postNotificacion'
import { getFlujoSolicitud } from '../../../../services/getFlujoSolicitud'
import { getArchivosFlujo } from '../../../../services/getArchivosFlujo'
import { getFlujoIngreso } from '../../../../services/getFlujoIngreso'
import { getFlujoOferta } from '../../../../services/getFlujoOferta'
import { getFlujoOrden } from '../../../../services/getFlujoOrden'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { getFlujoFacturaCantidad } from '../../../../services/getFlujoFacturaCantidad'
import { getFlujoFacturaDocumento } from '../../../../services/getFlujoFacturaDocumento'
import { useSession } from 'react-use-session'
import Chat from './Chat'
import FlujoBitacora from './FlujoBitacora'
import '../../../../scss/estilos.scss'
import { FaArrowLeft } from 'react-icons/fa'

const PagoTabs = () => {
  const history = useHistory()
  const location = useLocation()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [opcion, setOpcion] = useState(0)
  const [idFlujo, setIdFlujo] = useState(0)
  const [solicitud, setSolicitud] = useState([])
  const [oferta, setOferta] = useState([])
  const [orden, setOrden] = useState([])
  const [ingreso, setIngreso] = useState([])
  const [facturaCantidad, setFacturaCantidad] = useState([])
  const [facturaDocumento, setFacturaDocumento] = useState([])
  const [archivos, setArchivos] = useState([])
  const [permisos, setPermisos] = useState([])

  const handleOnIdle = (event) => {
    setShow(true)
    setOpcion(3)
    setMensaje(
      `Ya estuvo mucho tiempo sin realizar ninguna acción. Se cerrará sesión en unos minutos. Si desea continuar presione Aceptar`,
    )
    iniciar(2)
    console.log('last active', getLastActiveTime())
  }

  const handleOnActive = (event) => {
    console.log('time remaining', getRemainingTime())
  }

  const handleOnAction = (event) => {
    return false
  }

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * parseInt(session == null ? 1 : session.limiteconexion),
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500,
  })

  useEffect(() => {
    let mounted = true
    let objeto = 'Modulo Autorizacion Pagos'
    getFlujoSolicitud(location.id_flujo, null).then((items) => {
      if (mounted) {
        setSolicitud(items.solicitud)
      }
    })
    getFlujoOferta(location.id_flujo, null).then((items) => {
      if (mounted) {
        setOferta(items.oferta)
      }
    })
    getFlujoOrden(location.id_flujo, null).then((items) => {
      if (mounted) {
        setOrden(items.orden)
      }
    })
    getFlujoIngreso(location.id_flujo).then((items) => {
      if (mounted) {
        setIngreso(items.ingreso)
      }
    })
    getFlujoFacturaCantidad(location.id_flujo).then((items) => {
      if (mounted) {
        setFacturaCantidad(items.facturacantidad)
      }
    })
    getFlujoFacturaDocumento(location.id_flujo).then((items) => {
      if (mounted) {
        setFacturaDocumento(items.facturadocumento)
      }
    })
    getArchivosFlujo(location.id_flujo, null).then((items) => {
      if (mounted) {
        setArchivos(items.archivos)
      }
    })
    getPerfilUsuario(session.id, '4', objeto).then((items) => {
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
    } else if (opcion == 4) {
      setIdFlujo(id_flujo)
      setOpcion(opcion)
      setMensaje('Está seguro de pausar el pago?')
      setShow(true)
    } else if (opcion == 5) {
      setIdFlujo(id_flujo)
      setOpcion(opcion)
      setMensaje('Está seguro de actualizar y reiniciar el proceso de autorización del pago?')
      setShow(true)
    } else if (opcion == 55) {
      setIdFlujo(id_flujo)
      setOpcion(opcion)
      setMensaje('Está seguro de actualizar y continuar con el proceso de autorización del pago?')
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
              history.go(-1)
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
    } else if (opcion == 4) {
      const respuestaPausado = await postFlujos(id_flujo, '0', '', '4', null)
      const detalleFlujoActualizado = await postFlujoDetalle(
        id_flujo,
        '10',
        idUsuario,
        'Pausado',
        '0',
      )
      if (respuestaPausado == 'OK' && detalleFlujoActualizado == 'OK') {
        history.go(-1)
      }
    } else if (opcion == 5) {
      const respuestaActualizado = await postFlujos(id_flujo, '0', '', '5', null)
      const detalleFlujoActualizado = await postFlujoDetalle(
        id_flujo,
        '11',
        idUsuario,
        'Actualizado',
        '0',
      )
      if (respuestaActualizado == 'OK' && detalleFlujoActualizado == 'OK') {
        const respuestaReset = await postFlujos(id_flujo, '0', '', '6', null)
        const detalleFlujoReset = await postFlujoDetalle(
          id_flujo,
          '3',
          idUsuario,
          'Reinicio de autorización por actualización',
          '0',
        )
        if (respuestaReset == 'OK' && detalleFlujoReset == 'OK') {
          history.go(-1)
        }
      }
    } else if (opcion == 55) {
      const detalleFlujoActualizado = await postFlujoDetalle(
        id_flujo,
        '11',
        idUsuario,
        'Actualizado',
        '0',
      )
      if (detalleFlujoActualizado == 'OK') {
        const respuestaReset = await postFlujos(id_flujo, '0', '', '7', null)
        if (respuestaReset == 'OK') {
          history.go(-1)
        }
      }
    }
  }

  if (session) {
    if (location.id_flujo) {
      let grupo = 0
      let MostrarSolicitud = false
      let MostrarOferta = false
      let MostrarOrden = false
      let MostrarIngreso = false
      let MostrarFacturaCantidad = false
      let MostrarFacturaDocumento = false
      let MostrarArchivos = false
      let MostrarFacturas = false
      let MostrarRevision = ExistePermiso('Revisar')
      let MostrarPausado = true
      let MostrarActualizar = false
      let MostrarAprobarRechazar = false
      if (location.estado == 10) {
        MostrarActualizar = true
        MostrarPausado = false
      }
      if (location.id_grupo) {
        grupo = location.id_grupo
      }
      if (solicitud.length > 0) {
        MostrarSolicitud = true
      }
      if (oferta.length > 0) {
        MostrarOferta = true
      }
      if (orden.length > 0) {
        MostrarOrden = true
      }
      if (ingreso.length > 0) {
        MostrarIngreso = true
      }
      if (facturaCantidad.length > 0) {
        MostrarFacturaCantidad = true
      }
      if (facturaDocumento.length > 0) {
        MostrarFacturaDocumento = true
      }
      if (archivos.length > 0) {
        MostrarArchivos = true
      }
      if (
        (location.estado > 2 && location.estado < 5) ||
        location.estado == 10 ||
        location.estado == 11
      ) {
        MostrarAprobarRechazar = true
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
            <div
              className={MostrarRevision ? 'd-none float-right' : 'float-right'}
              style={{ marginTop: '15px', marginRight: '15px' }}
            >
              <CButton
                className={!MostrarAprobarRechazar ? 'd-none' : ''}
                color="success"
                size="sm"
                onClick={() => mostrarModal(location.id_flujo, 1)}
              >
                Aprobar
              </CButton>{' '}
              <CButton
                className={!MostrarAprobarRechazar ? 'd-none' : ''}
                color="danger"
                size="sm"
                onClick={() => mostrarModal(location.id_flujo, 2)}
              >
                Rechazar
              </CButton>
            </div>
            <div
              className={!MostrarRevision ? 'd-none float-right' : 'float-right'}
              style={{ marginTop: '15px', marginRight: '15px' }}
            >
              <CButton
                className={!MostrarPausado ? 'd-none' : ''}
                color="danger"
                size="sm"
                onClick={() => mostrarModal(location.id_flujo, 4)}
              >
                Pausar
              </CButton>{' '}
              <CButton
                className={!MostrarActualizar ? 'd-none' : ''}
                color="primary"
                size="sm"
                onClick={() => mostrarModal(location.id_flujo, 5)}
              >
                Actualizar y reiniciar
              </CButton>{' '}
              <CButton
                className={!MostrarActualizar ? 'd-none' : ''}
                color="info"
                size="sm"
                onClick={() => mostrarModal(location.id_flujo, 55)}
              >
                Actualizar y continuar
              </CButton>
            </div>
            <div className="float-left" style={{ marginBottom: '10px' }}>
              <Button variant="primary" size="sm" onClick={() => history.goBack()}>
                <FaArrowLeft />
                &nbsp;&nbsp;Regresar
              </Button>
            </div>
            <div className="div-content">
              <div style={{ width: '100%' }}>
                <Tabs defaultActiveKey="bitacora" id="uncontrolled-tab-example" className="mb-3">
                  <Tab eventKey="bitacora" title="Bitácora">
                    <FlujoBitacora id_flujo={location.id_flujo} />
                  </Tab>
                  <Tab
                    eventKey="solicitud"
                    title="Solicitud"
                    tabClassName={!MostrarSolicitud ? 'd-none' : ''}
                  >
                    <FlujoSolicitud results={solicitud} />
                  </Tab>
                  <Tab
                    eventKey="oferta"
                    title="Oferta Compra"
                    tabClassName={!MostrarOferta ? 'd-none' : ''}
                  >
                    <FlujoOferta results={oferta} />
                  </Tab>
                  <Tab
                    eventKey="orden"
                    title="Orden Compra"
                    tabClassName={!MostrarOrden ? 'd-none' : ''}
                  >
                    <FlujoOrden results={orden} />
                  </Tab>
                  <Tab
                    eventKey="ingreso"
                    title="Ingreso Bodega"
                    tabClassName={!MostrarIngreso ? 'd-none' : ''}
                  >
                    <FlujoIngreso results={ingreso} />
                  </Tab>
                  <Tab
                    eventKey="facturasCantidad"
                    title="Factura Cantidad"
                    tabClassName={!MostrarFacturaCantidad ? 'd-none' : ''}
                  >
                    <FlujoFacturaCantidad results={facturaCantidad} />
                  </Tab>
                  <Tab
                    eventKey="facturasDocumento"
                    title="Factura Documento"
                    tabClassName={!MostrarFacturaDocumento ? 'd-none' : ''}
                  >
                    <FlujoFacturaDocumento results={facturaDocumento} />
                  </Tab>
                  <Tab
                    eventKey="archivos"
                    title="Archivos"
                    tabClassName={!MostrarArchivos ? 'd-none' : ''}
                  >
                    <ArchivosFlujo results={archivos} estado={location.estado} />
                  </Tab>
                  <Tab eventKey="detalle" title="Detalle">
                    <DetalleFlujo id_flujo={location.id_flujo} />
                  </Tab>
                </Tabs>
              </div>
            </div>
            <Chat
              id_usuario={session.id}
              id_flujo={location.id_flujo}
              pago={location.pago}
              id_grupo={grupo}
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
            <div className="float-left" style={{ marginBottom: '10px' }}>
              <Button variant="primary" size="sm" onClick={() => history.goBack()}>
                <FaArrowLeft />
                &nbsp;&nbsp;Regresar
              </Button>
            </div>
            <div className="div-content">
              <div style={{ width: '100%' }}>
                <Tabs defaultActiveKey="bitacora" id="uncontrolled-tab-example" className="mb-3">
                  <Tab eventKey="bitacora" title="Bitácora">
                    <FlujoBitacora id_flujo={location.id_flujo} />
                  </Tab>
                  <Tab
                    eventKey="solicitud"
                    title="Solicitud"
                    tabClassName={!MostrarSolicitud ? 'd-none' : ''}
                  >
                    <FlujoSolicitud results={solicitud} />
                  </Tab>
                  <Tab
                    eventKey="oferta"
                    title="Oferta Compra"
                    tabClassName={!MostrarOferta ? 'd-none' : ''}
                  >
                    <FlujoOferta results={oferta} />
                  </Tab>
                  <Tab
                    eventKey="orden"
                    title="Orden Compra"
                    tabClassName={!MostrarOrden ? 'd-none' : ''}
                  >
                    <FlujoOrden results={orden} />
                  </Tab>
                  <Tab
                    eventKey="ingreso"
                    title="Ingreso Bodega"
                    tabClassName={!MostrarIngreso ? 'd-none' : ''}
                  >
                    <FlujoIngreso results={ingreso} />
                  </Tab>
                  <Tab
                    eventKey="facturasCantidad"
                    title="Factura Cantidad"
                    tabClassName={!MostrarFacturaCantidad ? 'd-none' : ''}
                  >
                    <FlujoFacturaCantidad results={facturaCantidad} />
                  </Tab>
                  <Tab
                    eventKey="facturasDocumento"
                    title="Factura Documento"
                    tabClassName={!MostrarFacturaDocumento ? 'd-none' : ''}
                  >
                    <FlujoFacturaDocumento results={facturaDocumento} />
                  </Tab>
                  <Tab
                    eventKey="archivos"
                    title="Archivos"
                    tabClassName={!MostrarArchivos ? 'd-none' : ''}
                  >
                    <ArchivosFlujo results={archivos} estado={location.estado} />
                  </Tab>
                  <Tab eventKey="detalle" title="Detalle">
                    <DetalleFlujo id_flujo={location.id_flujo} />
                  </Tab>
                </Tabs>
              </div>
            </div>
            <Chat
              id_usuario={session.id}
              id_flujo={location.id_flujo}
              pago={location.pago}
              id_grupo={grupo}
            />
          </div>
        )
      }
    } else {
      //history.go(-1)
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
