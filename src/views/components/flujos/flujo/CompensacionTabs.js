import React, { useState, useEffect } from 'react'
import { CButton } from '@coreui/react'
import { Tab, Tabs, Modal, Button } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import FlujoSolicitud from './FlujoSolicitud'
import FlujoOferta from './FlujoOferta'
import FlujoOrden from './FlujoOrden'
import FlujoIngreso from './FlujoIngreso'
import DetalleFlujo from './DetalleFlujo'
import ArchivosFlujo from './ArchivosFlujoF'
import { useSession } from 'react-use-session'
import FlujoFacturaCantidad from './FlujoFacturaCantidad'
import FlujoFacturaDocumento from './FlujoFacturaDocumento'
import FlujoBitacora from './FlujoBitacora'
import { useIdleTimer } from 'react-idle-timer'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { getFlujoSolicitud } from '../../../../services/getFlujoSolicitud'
import { getArchivosFlujo } from '../../../../services/getArchivosFlujo'
import { getFlujoIngreso } from '../../../../services/getFlujoIngreso'
import { getFlujoOferta } from '../../../../services/getFlujoOferta'
import { getFlujoOrden } from '../../../../services/getFlujoOrden'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { postFlujos } from '../../../../services/postFlujos'
import { postFlujoDetalle } from '../../../../services/postFlujoDetalle'
import { getFlujoFacturaCantidad } from '../../../../services/getFlujoFacturaCantidad'
import { getFlujoFacturaDocumento } from '../../../../services/getFlujoFacturaDocumento'
import '../../../../scss/estilos.scss'
import { FaArrowLeft } from 'react-icons/fa'

const CompensacionTabs = () => {
  const history = useHistory()
  const location = useLocation()
  const [time, setTime] = useState(null)
  const [show, setShow] = useState(false)
  const [showOperacion, setShowOperacion] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [mensajeOperacion, setMensajeOperacion] = useState('')
  const { session, clear } = useSession('PendrogonIT-Session')
  const [solicitud, setSolicitud] = useState([])
  const [oferta, setOferta] = useState([])
  const [orden, setOrden] = useState([])
  const [ingreso, setIngreso] = useState([])
  const [facturaCantidad, setFacturaCantidad] = useState([])
  const [facturaDocumento, setFacturaDocumento] = useState([])
  const [archivos, setArchivos] = useState([])
  const [permisos, setPermisos] = useState([])
  const [idFlujo, setIdFlujo] = useState(0)
  const [opcion, setOpcion] = useState(0)
  const [opcionOperacion, setOpcionOperacion] = useState(0)

  useEffect(() => {
    let mounted = true
    let objeto = 'Modulo Compensacion Pagos'
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

  async function Cancelar(opcion) {
    if (opcion == 1) {
      setShow(false)
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
    } else {
      setShow(false)
    }
  }

  function mostrarModal(id_flujo, opcion) {
    if (opcion == 5) {
      setIdFlujo(id_flujo)
      setOpcionOperacion(opcion)
      setMensajeOperacion('¿Está seguro de actualizar el pago?')
      setShowOperacion(true)
    }
    if (opcion == 6) {
      setIdFlujo(id_flujo)
      setOpcionOperacion(opcion)
      setMensajeOperacion(
        '¿Está seguro que desea regresar el pago a pendientes de compenzar para que sea reprocesado?',
      )
      setShowOperacion(true)
    }
    if (opcion == 7) {
      setIdFlujo(id_flujo)
      setOpcionOperacion(opcion)
      setMensajeOperacion(
        '¿Está seguro que desea solicitar el retorno del pago a bandeja de pendientes?',
      )
      setShowOperacion(true)
    }
    if (opcion == 8) {
      setIdFlujo(id_flujo)
      setOpcionOperacion(opcion)
      setMensajeOperacion(
        '¿Está seguro que desea rechazar la solicitar de retorno del pago a bandeja de pendientes?',
      )
      setShowOperacion(true)
    }
  }

  async function Aprobar_Rechazar(id_flujo, opcion) {
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    let pagos = []
    pagos.push(id_flujo)
    if (opcion == 5) {
      const detalleFlujoActualizado = await postFlujoDetalle(
        id_flujo,
        '11',
        idUsuario,
        'Actualizado',
        '0',
      )
      if (detalleFlujoActualizado == 'OK') {
        const respuestaActualizado = await postFlujos(id_flujo, '0', '', '66', null, idUsuario)

        if (respuestaActualizado == 'OK') {
          history.go(-1)
        }
      }
    }
    if (opcion == 6) {
      const respuestaActualizado = await postFlujos(id_flujo, '0', '', '67', null, idUsuario)
      const detalleFlujoActualizado = await postFlujoDetalle(
        id_flujo,
        '5',
        idUsuario,
        'Restituido a pendientes de compensar para su reprocesamiento',
        '0',
      )
      if (respuestaActualizado == 'OK' && detalleFlujoActualizado == 'OK') {
        history.go(-1)
      }
    }
    if (opcion == 7) {
      const respuestaActualizado = await postFlujos(id_flujo, '0', '', '68', null, idUsuario)
      const detalleFlujoActualizado = await postFlujoDetalle(
        id_flujo,
        '12',
        idUsuario,
        'Generada solicitud para retorno a bandeja de pendientes',
        '0',
      )
      if (respuestaActualizado == 'OK' && detalleFlujoActualizado == 'OK') {
        history.go(-1)
      }
    }
    if (opcion == 8) {
      const respuestaActualizado = await postFlujos(id_flujo, '0', '', '69', null, idUsuario)
      const detalleFlujoActualizado = await postFlujoDetalle(
        id_flujo,
        '13',
        idUsuario,
        'Rechazada solicitud para retorno a bandeja de pendientes',
        '0',
      )
      if (respuestaActualizado == 'OK' && detalleFlujoActualizado == 'OK') {
        history.go(-1)
      }
    }
  }

  if (session) {
    if (location.id_flujo) {
      let MostrarSolicitud = false
      let MostrarOferta = false
      let MostrarOrden = false
      let MostrarIngreso = false
      let MostrarArchivos = false
      let MostrarFacturas = false
      let MostrarActualizar = ExistePermiso('Actualizar')
      let MostrarReprocesar = ExistePermiso('Reprocesar')
      let MostrarFacturaCantidad = false
      let MostrarFacturaDocumento = false
      let MostrarSolicitudRetorno = false
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
        location.estado == '7' ||
        location.estado == '9' ||
        location.estado == '12' ||
        location.estado == '13'
      ) {
        MostrarActualizar = false
      }
      if (location.estado != '12') {
        MostrarReprocesar = false
      }
      if (location.estado == '9') {
        MostrarSolicitudRetorno = true
      }
      return (
        <div className="div-tabs">
          <Modal responsive variant="primary" show={show} onHide={() => Cancelar(opcion)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Confirmación</Modal.Title>
            </Modal.Header>
            <Modal.Body>{mensaje}</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => Cancelar(opcion)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={() => Cancelar(opcion)}>
                Aceptar
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal
            responsive
            variant="primary"
            show={showOperacion}
            onHide={() => Cancelar(opcionOperacion)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirmación</Modal.Title>
            </Modal.Header>
            <Modal.Body>{mensajeOperacion}</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => Cancelar(opcionOperacion)}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() =>
                  Aprobar_Rechazar(idFlujo, opcionOperacion).then(() => Cancelar(opcionOperacion))
                }
              >
                Aceptar
              </Button>
            </Modal.Footer>
          </Modal>
          <div
            className={!MostrarActualizar ? 'd-none float-right' : 'float-right'}
            style={{ marginTop: '15px', marginRight: '15px' }}
          >
            <CButton
              className={!MostrarActualizar ? 'd-none' : ''}
              color="info"
              size="sm"
              onClick={() => mostrarModal(location.id_flujo, 5)}
            >
              Actualizar
            </CButton>
          </div>
          <div
            className={!MostrarReprocesar ? 'd-none float-right' : 'float-right'}
            style={{ marginTop: '15px', marginRight: '15px' }}
          >
            <CButton
              className={!MostrarReprocesar ? 'd-none' : ''}
              color="info"
              size="sm"
              onClick={() => mostrarModal(location.id_flujo, 6)}
            >
              Aprobar solicitud
            </CButton>{' '}
            <CButton
              className={!MostrarReprocesar ? 'd-none' : ''}
              color="danger"
              size="sm"
              onClick={() => mostrarModal(location.id_flujo, 8)}
            >
              Rechazar solicitud
            </CButton>
          </div>
          <div
            className={!MostrarSolicitudRetorno ? 'd-none float-right' : 'float-right'}
            style={{ marginTop: '15px', marginRight: '15px' }}
          >
            <CButton
              className={!MostrarSolicitudRetorno ? 'd-none' : ''}
              color="info"
              size="sm"
              onClick={() => mostrarModal(location.id_flujo, 7)}
            >
              Solicitar retorno a bandeja
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
              <Tabs defaultActiveKey="archivos" id="uncontrolled-tab-example" className="mb-3">
                <Tab
                  eventKey="archivos"
                  title="Soporte"
                  tabClassName={!MostrarArchivos ? 'd-none' : ''}
                >
                  <ArchivosFlujo results={archivos} />
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
                <Tab eventKey="bitacora" title="Bitácora">
                  <FlujoBitacora id_flujo={location.id_flujo} />
                </Tab>
                <Tab eventKey="detalle" title="Detalle">
                  <DetalleFlujo id_flujo={location.id_flujo} />
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
