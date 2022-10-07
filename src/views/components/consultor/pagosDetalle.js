import React, { useState, useEffect } from 'react'
import { Row, Col, Container, Tab, Tabs, Button } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import FlujoSolicitud from '../flujos/flujo/FlujoSolicitud'
import FlujoOferta from '../flujos/flujo/FlujoOferta'
import FlujoOrden from '../flujos/flujo/FlujoOrden'
import FlujoIngreso from '../flujos/flujo/FlujoIngreso'
import DetalleFlujo from '../flujos/flujo/DetalleFlujo'
import FlujoFacturaCantidad from '../flujos/flujo/FlujoFacturaCantidad'
import FlujoFacturaDocumento from '../flujos/flujo/FlujoFacturaDocumento'
import ArchivosFlujo from '../flujos/flujo/ArchivosFlujoF'
import { getFlujoSolicitud } from '../../../services/getFlujoSolicitud'
import { getArchivosFlujo } from '../../../services/getArchivosFlujo'
import { getFlujoIngreso } from '../../../services/getFlujoIngreso'
import { getFlujoOferta } from '../../../services/getFlujoOferta'
import { getFlujoOrden } from '../../../services/getFlujoOrden'
import { getPerfilUsuario } from '../../../services/getPerfilUsuario'
import { getFlujoFacturaCantidad } from '../../../services/getFlujoFacturaCantidad'
import { getFlujoFacturaDocumento } from '../../../services/getFlujoFacturaDocumento'
import { getBitacora } from '../../../services/getBitacora'
import { getDetalle } from '../../../services/getDetalle'
import { useSession } from 'react-use-session'
/* import Chat from './Chat' */
import FlujoBitacora from '../flujos/flujo/FlujoBitacora'
import '../../../scss/estilos.scss'
import { FaArrowLeft, FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import { getUsuarioPrioridadMensajes } from '../../../services/getUsuarioPrioridadMensajes'
import { getUsuarios } from '../../../services/getUsuarios'
import { getContadorChat } from '../../../services/getContadorChat'
import { getGruposAutorizacion } from '../../../services/getGruposAutorizacion'
import { getUsuarioGrupo } from '../../../services/getUsuarioGrupo'

const ConsultorPagosDetalle = () => {
  const history = useHistory()
  const location = useLocation()
  const { session, clear } = useSession('PendrogonIT-Session')
  const [solicitud, setSolicitud] = useState([])
  const [oferta, setOferta] = useState([])
  const [orden, setOrden] = useState([])
  const [ingreso, setIngreso] = useState([])
  const [facturaCantidad, setFacturaCantidad] = useState([])
  const [facturaDocumento, setFacturaDocumento] = useState([])
  const [archivos, setArchivos] = useState([])
  const [permisos, setPermisos] = useState([])
  const [bitacora, setListBitacora] = useState([])
  const [MostrarRevision, setMostrarRevision] = useState(false)
  const [MostrarAutorizar, setMostrarAutorizar] = useState(false)
  const [llaveBitacora, setllaveBitacora] = useState(0)
  const [ocultarBotones, setOcultarBotones] = useState(false)
  const [pagoAnterior, setPagoAnterior] = useState({})
  const [hayPagoAnterior, setHayPagoAnterior] = useState(false)
  const [pagoPosterior, setPagoPosterior] = useState({})
  const [hayPagoPosterior, setHayPagoPosterior] = useState(false)
  const [locationPago, setLocationPago] = useState(location.pago)
  const [locationEstado, setLocationEstado] = useState(location.estado)
  const [locationIdFlujo, setLocationIdFlujo] = useState(location.id_flujo)
  const [locationNivel, setLocationNivel] = useState(location.nivel)
  const [locationIdGrupo, setLocationIdGrupo] = useState(location.id_grupo)
  const [locationPuedoAutorizar, setLocationPuedoAutorizar] = useState(location.PuedoAutorizar)
  const [locationSeccion, setLocationSeccion] = useState(location.seccion)
  const [actualizarDatos, setActualizarDatos] = useState(false)

  //Estados validaciones pestañas
  const [MostrarSolicitud, setMostrarSolicitud] = useState(false)
  const [grupo, setGrupo] = useState(0)
  const [MostrarOferta, setMostrarOferta] = useState(false)
  const [MostrarOrden, setMostrarOrden] = useState(false)
  const [MostrarIngreso, setMostrarIngreso] = useState(false)
  const [MostrarFacturaCantidad, setMostrarFacturaCantidad] = useState(false)
  const [MostrarFacturaDocumento, setMostrarFacturaDocumento] = useState(false)
  const [MostrarAprobarRechazar, setMostrarAprobarRechazar] = useState(false)
  const [yaAutorizo, setYaAutorizo] = useState(false)
  const [keyArchivosFlujo, setKeyArchivosFlujo] = useState(0)
  const [keyFlujoSolicitud, setKeyFlujoSolicitud] = useState(0)
  const [keyFlujoOferta, setKeyFlujoOferta] = useState(0)
  const [keyFlujoOrden, setKeyFlujoOrden] = useState(0)
  const [keyFlujoIngreso, setKeyFlujoIngreso] = useState(0)
  const [keyFlujoFacturaCantidad, setKeyFlujoFacturaCantidad] = useState(0)
  const [keyFlujoFacturaDocumento, setKeyFlujoFacturaDocumento] = useState(0)
  const [keyDetalleFlujo, setKeyDetalleFlujo] = useState(0)
  const [desBotonSeleccionar, setDesBotonSeleccionar] = useState(false)
  const [detalleFlujo, setDetlleFlujo] = useState([])
  const [resultsPrioridad, setListPrioridad] = useState([])
  const [keyChat, setkeyChat] = useState(0)
  const [usuarios, setListUsuarios] = useState([])
  const [contadorMensajesRecibidos, setContadorMensajesRecibidos] = useState(0)
  const [gruposList, setGruposList] = useState([])
  const [MostrarAsignacion, setMostrarAsignacion] = useState(false)
  const [usuarioGrupoList, setUsuarioGrupoList] = useState([])

  useEffect(() => {
    let listaPagos
    if (locationSeccion == 'Autorizados') {
      listaPagos = JSON.parse(sessionStorage.getItem('ConsultorPagosAutorizados'))
    }
    if (locationSeccion == 'Cancelados') {
      listaPagos = JSON.parse(sessionStorage.getItem('ConsultorPagosCancelados'))
    }
    if (locationSeccion == 'Compensados') {
      listaPagos = JSON.parse(sessionStorage.getItem('ConsultorPagosCompensados'))
    }
    if (locationSeccion == 'NoVisados') {
      listaPagos = JSON.parse(sessionStorage.getItem('ConsultorPagosNoVisados'))
    }
    if (locationSeccion == 'PagadosBanco') {
      listaPagos = JSON.parse(sessionStorage.getItem('ConsultorPagosPagadosBanco'))
    }
    if (locationSeccion == 'Pendientes') {
      listaPagos = JSON.parse(sessionStorage.getItem('ConsultorPagosPendientes'))
    }
    if (locationSeccion == 'Rechazados') {
      listaPagos = JSON.parse(sessionStorage.getItem('ConsultorPagosRechazados'))
    }
    if (locationSeccion == 'RechazadosBanco') {
      listaPagos = JSON.parse(sessionStorage.getItem('ConsultorPagosRechazadosBanco'))
    }
    if (locationSeccion == 'Reemplazados') {
      listaPagos = JSON.parse(sessionStorage.getItem('ConsultorPagosReemplazados'))
    }
    let indexActual = listaPagos.findIndex((e) => e.pago == locationPago)
    let largoPagos = listaPagos.length
    let yaAutorizoInterno = ExisteEnBitacora(session.id)
    setYaAutorizo(yaAutorizoInterno)

    let yaEstaMarcado = sessionStorage.getItem(
      locationIdFlujo + '|' + locationEstado + '|' + locationNivel,
    )
    if (yaEstaMarcado === 'true') {
      setDesBotonSeleccionar(true)
    } else {
      setDesBotonSeleccionar(false)
    }

    if (!yaAutorizoInterno && locationEstado != 10 && locationPuedoAutorizar == '1') {
      setMostrarAprobarRechazar(true)
    } else {
      setMostrarAprobarRechazar(false)
    }
    if (locationIdGrupo) {
      setGrupo(locationIdGrupo)
    }
    if (indexActual > 0) {
      setPagoAnterior(listaPagos[indexActual - 1])
      setHayPagoAnterior(true)
    } else {
      setHayPagoAnterior(false)
    }
    if (indexActual < largoPagos - 1) {
      setPagoPosterior(listaPagos[indexActual + 1])
      setHayPagoPosterior(true)
    } else {
      setHayPagoPosterior(false)
    }
    let mounted = true
    getGruposAutorizacion(null, null, session.api_token).then((items) => {
      if (mounted) {
        setGruposList(items.grupos)
      }
    })
    getUsuarioGrupo(session.id, null, session.api_token).then((items) => {
      if (mounted) {
        setUsuarioGrupoList(items.detalle)
      }
    })
    let objeto = 'Modulo Autorizacion Pagos'

    getDetalle(locationIdFlujo, session.api_token).then((items) => {
      if (mounted) {
        setDetlleFlujo(items.flujos[0])
      }
    })
    getFlujoSolicitud(locationIdFlujo, null, session.api_token).then((items) => {
      if (mounted) {
        setSolicitud(items.solicitud)
        if (items.solicitud.length > 0) {
          setMostrarSolicitud(true)
        } else {
          setMostrarSolicitud(false)
        }
      }
    })
    getFlujoOferta(locationIdFlujo, null, session.api_token).then((items) => {
      if (mounted) {
        setOferta(items.oferta)
        if (items.oferta.length > 0) {
          setMostrarOferta(true)
        } else {
          setMostrarOferta(false)
        }
      }
    })
    getFlujoOrden(locationIdFlujo, null, session.api_token).then((items) => {
      if (mounted) {
        setOrden(items.orden)
        if (items.orden.length > 0) {
          setMostrarOrden(true)
        } else {
          setMostrarOrden(false)
        }
      }
    })
    getFlujoIngreso(locationIdFlujo, session.api_token).then((items) => {
      if (mounted) {
        setIngreso(items.ingreso)
        if (items.ingreso.length > 0) {
          setMostrarIngreso(true)
        } else {
          setMostrarIngreso(false)
        }
      }
    })
    getFlujoFacturaCantidad(locationIdFlujo, session.api_token).then((items) => {
      if (mounted) {
        setFacturaCantidad(items.facturacantidad)
        if (items.facturacantidad.length > 0) {
          setMostrarFacturaCantidad(true)
        } else {
          setMostrarFacturaCantidad(false)
        }
      }
    })
    getFlujoFacturaDocumento(locationIdFlujo, session.api_token).then((items) => {
      if (mounted) {
        setFacturaDocumento(items.facturadocumento)
        if (items.facturadocumento.length > 0) {
          setMostrarFacturaDocumento(true)
        } else {
          setMostrarFacturaDocumento(false)
        }
      }
    })
    getArchivosFlujo(locationIdFlujo, null, session.api_token).then((items) => {
      if (mounted) {
        setArchivos(items.archivos)
      }
    })
    getPerfilUsuario(session.id, '4', objeto, session.api_token).then((items) => {
      if (mounted) {
        setPermisos(items.detalle)
        setOcultarBotones(false)
        setOcultarBotones(false)
        setMostrarAutorizar(false)
        setMostrarAsignacion(false)
        for (let item of items.detalle) {
          if ('Cargar' == item.descripcion) {
            setOcultarBotones(true)
          }
          if ('Visualizar_completo' == item.descripcion) {
            setOcultarBotones(true)
          }
          if ('Autorizar' == item.descripcion) {
            setMostrarAutorizar(true)
          }
          if ('Asignar' == item.descripcion) {
            setMostrarAsignacion(true)
          }
        }
      }
    })
    getBitacora(locationIdFlujo, session.api_token).then((items) => {
      if (mounted) {
        setListBitacora(items.bitacora)
      }
    })
    getUsuarioPrioridadMensajes(session.id, session.api_token)
      .then((items) => {
        if (mounted) {
          setListPrioridad(items.prioridad)
        }
      })
      .then(() => {
        let locationIdGrupoTmp = 0
        if (locationIdGrupo != null && locationIdGrupo != undefined) {
          locationIdGrupoTmp = locationIdGrupo
        }
        getUsuarios(locationIdGrupoTmp, locationIdFlujo, null, null, session.api_token)
          .then((items) => {
            if (mounted) {
              setListUsuarios(items.users)
            }
          })
          .then(() => setkeyChat(keyChat + 1))
      })
    let contMensajes = 0
    getContadorChat(locationIdFlujo, session.id, session.api_token).then((items) => {
      items.mensajes.map((item) => {
        if (item.eliminado == 0) {
          if (item.leido == 0) {
            contMensajes++
          }
        }
      })
      setContadorMensajesRecibidos(contMensajes)
    })

    setInterval(() => {
      let contMensajes = 0
      getContadorChat(locationIdFlujo, session.id, session.api_token).then((items) => {
        items.mensajes.map((item) => {
          if (item.eliminado == 0) {
            if (item.leido == 0) {
              contMensajes++
            }
          }
        })
        setContadorMensajesRecibidos(contMensajes)
      })
    }, 3000)
    return () => (mounted = false)
  }, [actualizarDatos])

  function ExisteEnBitacora(usuario) {
    let result = false
    for (let item of bitacora) {
      if (usuario == item.id_usuario && item.IdEstadoFlujo == 4 && item.FlujoActivo == 1) {
        result = true
      }
    }
    return result
  }

  const formatear = (valor, moneda) => {
    if (moneda === 'QTZ') {
      return formatter.format(valor)
    } else {
      return formatterDolar.format(valor)
    }
  }

  let formatter = new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
  })
  let formatterDolar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  function pasarOtroPago(AntesDespues) {
    if (AntesDespues == 'A') {
      setLocationPago(pagoAnterior.pago)
      setLocationEstado(pagoAnterior.estado)
      setLocationIdFlujo(pagoAnterior.id_flujo)
      setLocationNivel(pagoAnterior.nivel)
      setLocationIdGrupo(pagoAnterior.id_grupo)
      setLocationPuedoAutorizar(pagoAnterior.PuedoAutorizar)
    } else {
      setLocationPago(pagoPosterior.pago)
      setLocationEstado(pagoPosterior.estado)
      setLocationIdFlujo(pagoPosterior.id_flujo)
      setLocationNivel(pagoPosterior.nivel)
      setLocationIdGrupo(pagoPosterior.id_grupo)
      setLocationPuedoAutorizar(pagoPosterior.PuedoAutorizar)
    }
    setActualizarDatos(!actualizarDatos)
    setllaveBitacora(llaveBitacora + 1)
    setKeyArchivosFlujo(keyArchivosFlujo + 1)
    setKeyFlujoSolicitud(keyFlujoSolicitud + 1)
    setKeyFlujoOferta(keyFlujoOferta + 1)
    setKeyFlujoOrden(keyFlujoOrden + 1)
    setKeyFlujoIngreso(keyFlujoIngreso + 1)
    setKeyFlujoFacturaCantidad(keyFlujoFacturaCantidad + 1)
    setKeyFlujoFacturaDocumento(keyFlujoFacturaDocumento + 1)
    setKeyDetalleFlujo(keyDetalleFlujo + 1)
  }

  if (session) {
    if (locationIdFlujo) {
      return (
        <div className="div-tabs">
          <div
            style={{
              display: 'flex',
              gap: '10px',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              paddingTop: '10px',
              marginRight: '10px',
            }}
          >
            <div
              style={{ width: '80%', display: 'flex', gap: '10px', justifyContent: 'flex-start' }}
            >
              <div style={{ width: '25%', marginLeft: '10px' }}>
                <Button variant="primary" size="sm" onClick={() => history.goBack()}>
                  <FaArrowLeft />
                  &nbsp;&nbsp;Regresar
                </Button>
              </div>
            </div>
            <div style={{ width: '20%', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <Button
                data-tag="allowRowEvents"
                variant="primary"
                size="sm"
                title="Consultar pago anterior"
                disabled={!hayPagoAnterior}
                onClick={() => pasarOtroPago('A')}
              >
                <FaAngleLeft />
              </Button>
              <Button
                data-tag="allowRowEvents"
                variant="primary"
                size="sm"
                title="Consultar pago posterior"
                disabled={!hayPagoPosterior}
                onClick={() => pasarOtroPago('D')}
              >
                <FaAngleRight />
              </Button>
            </div>
          </div>
          <br />
          <br />
          <div style={{ display: 'flex' }}>
            <div style={{ width: '15%' }}>&nbsp;</div>
            <div style={{ marginTop: '10px', width: '70%', display: 'flex', alignItems: 'center' }}>
              <Container className="mb-0">
                <Row className="mb-0">
                  <Col className="mb-0 border column">Empresa</Col>
                  <Col className="mb-0 border">{detalleFlujo.empresa_nombre}</Col>
                </Row>
                <Row className="mb-0">
                  <Col className="mb-0 border column">Número Documento</Col>
                  <Col className="mb-0 border">{detalleFlujo.doc_num}</Col>
                </Row>
                <Row className="mb-0">
                  <Col className="mb-0 border column">Beneficiario</Col>
                  <Col className="mb-0 border">{detalleFlujo.en_favor_de}</Col>
                </Row>
                <Row className="mb-0">
                  <Col className="mb-0 border column">Concepto</Col>
                  <Col className="mb-0 border">{detalleFlujo.comments}</Col>
                </Row>
                <Row className="mb-0">
                  <Col className="mb-0 border column">Monto</Col>
                  <Col className="mb-0 border">
                    {formatear(detalleFlujo.doc_total, detalleFlujo.doc_curr)}
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
          <br />
          <br />
          <div className="div-content">
            <div style={{ width: '100%' }}>
              <Tabs defaultActiveKey="archivos" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="archivos" title="Soporte">
                  <ArchivosFlujo
                    key={keyArchivosFlujo}
                    results={archivos}
                    estado={locationEstado}
                    empresa={detalleFlujo.empresa_nombre}
                    docNum={detalleFlujo.doc_num}
                    beneficiario={detalleFlujo.en_favor_de}
                    concepto={detalleFlujo.comments}
                    monto={formatear(detalleFlujo.doc_total, detalleFlujo.doc_curr)}
                  />
                </Tab>
                <Tab
                  eventKey="solicitud"
                  title="Solicitud"
                  tabClassName={!MostrarSolicitud ? 'd-none' : ''}
                >
                  <FlujoSolicitud key={keyFlujoSolicitud} results={solicitud} />
                </Tab>
                <Tab
                  eventKey="oferta"
                  title="Oferta Compra"
                  tabClassName={!MostrarOferta ? 'd-none' : ''}
                >
                  <FlujoOferta key={keyFlujoOferta} results={oferta} />
                </Tab>
                <Tab
                  eventKey="orden"
                  title="Orden Compra"
                  tabClassName={!MostrarOrden ? 'd-none' : ''}
                >
                  <FlujoOrden key={keyFlujoOrden} results={orden} />
                </Tab>
                <Tab
                  eventKey="ingreso"
                  title="Ingreso Bodega"
                  tabClassName={!MostrarIngreso ? 'd-none' : ''}
                >
                  <FlujoIngreso key={keyFlujoIngreso} results={ingreso} />
                </Tab>
                <Tab
                  eventKey="facturasCantidad"
                  title="Factura Cantidad"
                  tabClassName={!MostrarFacturaCantidad ? 'd-none' : ''}
                >
                  <FlujoFacturaCantidad key={keyFlujoFacturaCantidad} results={facturaCantidad} />
                </Tab>
                <Tab
                  eventKey="facturasDocumento"
                  title="Factura Documento"
                  tabClassName={!MostrarFacturaDocumento ? 'd-none' : ''}
                >
                  <FlujoFacturaDocumento
                    key={keyFlujoFacturaDocumento}
                    results={facturaDocumento}
                  />
                </Tab>
                <Tab eventKey="bitacora" title="Bitácora">
                  <FlujoBitacora key={llaveBitacora} id_flujo={locationIdFlujo} />
                </Tab>
                <Tab eventKey="detalle" title="Detalle">
                  <DetalleFlujo key={keyDetalleFlujo} id_flujo={locationIdFlujo} />
                </Tab>
              </Tabs>
            </div>
          </div>
          <div
            className={contadorMensajesRecibidos == 0 ? 'd-none' : ''}
            style={{
              zIndex: 2,
              position: 'fixed',
              bottom: '80px',
              right: '20px',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              borderRadius: '50%',
              background: '#ff4646',
              color: '#fff',
              textAlign: 'center',
              margin: 'auto',
              fontWeight: '500',
              boxShadow: '-1px 1px 2px rgba(0,0,0,.3)',
              width: '22px',
              height: '22px',
              fontSize: '12px',
            }}
          >
            {contadorMensajesRecibidos}
          </div>
          {/*  <Chat
            style={{ zIndex: 1 }}
            key={keyChat}
            id_usuario={session.id}
            id_flujo={locationIdFlujo}
            pago={locationPago}
            id_grupo={grupo}
            token={session.api_token}
            prioridad_usuario={resultsPrioridad}
            lista_usuarios={usuarios}
        /> */}
        </div>
      )
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

export default ConsultorPagosDetalle
