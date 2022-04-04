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
import { getBitacora } from '../../../../services/getBitacora'
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
  const [bitacora, setListBitacora] = useState([])
  const [MostrarPausado, setMostrarPausado] = useState(true)
  const [MostrarRevision, setMostrarRevision] = useState(false)
  const [MostrarActualizar, setMostrarActualizar] = useState(false)
  const [llaveBitacora, setllaveBitacora] = useState(0)
  const [ocultarBotones, setOcultarBotones] = useState(false)

  useEffect(() => {
    let mounted = true
    let objeto = 'Modulo Autorizacion Pagos'
    if (location.estado == 10) {
      setMostrarPausado(false)
      setMostrarActualizar(true)
    }
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
        for (let item of items.detalle) {
          if ('Revisar' == item.descripcion) {
            setMostrarRevision(true)
          }
          if ('Cargar' == item.descripcion) {
            setOcultarBotones(true)
          }
          if ('Visualizar_completo' == item.descripcion) {
            setOcultarBotones(true)
          }
        }
      }
    })
    getBitacora(location.id_flujo).then((items) => {
      if (mounted) {
        setListBitacora(items.bitacora)
      }
    })
    return () => (mounted = false)
  }, [])

  function ExisteEnBitacora(usuario) {
    let result = false
    for (let item of bitacora) {
      if (usuario == item.id_usuario && item.IdEstadoFlujo == 4 && item.FlujoActivo == 1) {
        result = true
      }
    }
    return result
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
    } else {
      setShow(false)
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
        const respuesta = await postFlujos(id_flujo, '2', '', '', null, idUsuario)
        const aprobado = await postFlujoDetalle(id_flujo, '4', idUsuario, 'Aprobado', '1')
        if (respuesta == 'OK' && aprobado == 'OK') {
          history.go(-1)
        }
      } else if (location.estado == 4) {
        const respuesta = await postFlujos(id_flujo, location.nivel, '', '', null, idUsuario)
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
      const respuesta = await postFlujos(id_flujo, '', '', '1', null, idUsuario)
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
      setMostrarPausado(false)
      const respuestaPausado = await postFlujos(id_flujo, '0', '', '4', null, idUsuario)
      const detalleFlujoActualizado = await postFlujoDetalle(
        id_flujo,
        '10',
        idUsuario,
        'Pausado',
        '0',
      )
      if (respuestaPausado == 'OK' && detalleFlujoActualizado == 'OK') {
        setMostrarActualizar(true)
        setllaveBitacora(llaveBitacora + 1)
      } else {
        setMostrarPausado(true)
      }
    } else if (opcion == 5) {
      const respuestaActualizado = await postFlujos(id_flujo, '0', '', '5', null, idUsuario)
      const detalleFlujoActualizado = await postFlujoDetalle(
        id_flujo,
        '11',
        idUsuario,
        'Actualizado',
        '0',
      )
      if (respuestaActualizado == 'OK' && detalleFlujoActualizado == 'OK') {
        const respuestaReset = await postFlujos(id_flujo, '0', '', '6', null, idUsuario)
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
        const respuestaReset = await postFlujos(id_flujo, '0', '', '7', null, idUsuario)
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
      let yaAutorizo = ExisteEnBitacora(session.id)
      let MostrarAprobarRechazar = false
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
        if (!yaAutorizo) {
          MostrarAprobarRechazar = true
        }
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
            <div className={ocultarBotones ? 'd-none float-right' : 'float-right'}>
              <div
                className={MostrarRevision && !yaAutorizo ? 'd-none float-right' : 'float-right'}
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
                  <Tab eventKey="archivos" title="Soporte">
                    <ArchivosFlujo results={archivos} estado={location.estado} />
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
                    <FlujoBitacora key={llaveBitacora} id_flujo={location.id_flujo} />
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
                <Tabs defaultActiveKey="archivos" id="uncontrolled-tab-example" className="mb-3">
                  <Tab eventKey="archivos" title="Soporte">
                    <ArchivosFlujo results={archivos} estado={location.estado} />
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
