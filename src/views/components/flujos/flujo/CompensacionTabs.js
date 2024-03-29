import React, { useState, useEffect } from 'react'
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
import { getFlujoFacturaCantidad } from '../../../../services/getFlujoFacturaCantidad'
import { getFlujoFacturaDocumento } from '../../../../services/getFlujoFacturaDocumento'
import '../../../../scss/estilos.scss'

const CompensacionTabs = () => {
  const history = useHistory()
  const location = useLocation()
  const [time, setTime] = useState(null)
  const [show, setShow] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const { session, clear } = useSession('PendrogonIT-Session')
  const [solicitud, setSolicitud] = useState([])
  const [oferta, setOferta] = useState([])
  const [orden, setOrden] = useState([])
  const [ingreso, setIngreso] = useState([])
  const [facturaCantidad, setFacturaCantidad] = useState([])
  const [facturaDocumento, setFacturaDocumento] = useState([])
  const [archivos, setArchivos] = useState([])

  useEffect(() => {
    let mounted = true
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
    return () => (mounted = false)
  }, [])

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
      let MostrarSolicitud = false
      let MostrarOferta = false
      let MostrarOrden = false
      let MostrarIngreso = false
      let MostrarArchivos = false
      let MostrarFacturaCantidad = false
      let MostrarFacturaDocumento = false
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
              <Tabs defaultActiveKey="detalle" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="detalle" title="Detalle">
                  <DetalleFlujo id_flujo={location.id_flujo} />
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
                  <ArchivosFlujo results={archivos} />
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
