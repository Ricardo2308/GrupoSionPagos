import React, { useState, useEffect } from 'react'
import { Row, Col, Container, Modal, Tab, Tabs, Button } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
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
import { getDetalle } from '../../../../services/getDetalle'
import { useSession } from 'react-use-session'
import Chat from './Chat'
import FlujoBitacora from './FlujoBitacora'
import '../../../../scss/estilos.scss'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import { getUsuarioPrioridadMensajes } from '../../../../services/getUsuarioPrioridadMensajes'
import { getUsuarios } from '../../../../services/getUsuarios'
import { getContadorChat } from '../../../../services/getContadorChat'
import { getGruposAutorizacion } from '../../../../services/getGruposAutorizacion'
import { CButton } from '@coreui/react'
import { getUsuarioGrupo } from '../../../../services/getUsuarioGrupo'
import { getPendientesAutorizacionCompleto } from '../../../../services/getPendientesAutorizacionCompleto'

const PagoTabsCompleto = () => {
  const history = useHistory()
  const location = useLocation()
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
  const [MostrarAutorizar, setMostrarAutorizar] = useState(false)
  const [MostrarActualizar, setMostrarActualizar] = useState(false)
  const [llaveBitacora, setllaveBitacora] = useState(0)
  const [ocultarBotones, setOcultarBotones] = useState(false)
  const [pagoAnterior, setPagoAnterior] = useState({})
  const [hayPagoAnterior, setHayPagoAnterior] = useState(false)
  const [pagoPosterior, setPagoPosterior] = useState({})
  const [hayPagoPosterior, setHayPagoPosterior] = useState(false)
  const [locationPagoInicial, setLocationPagoInicial] = useState('')
  const [locationPago, setLocationPago] = useState('')
  const [locationEstado, setLocationEstado] = useState('')
  const [locationIdFlujo, setLocationIdFlujo] = useState('')
  const [locationNivel, setLocationNivel] = useState('')
  const [locationIdGrupo, setLocationIdGrupo] = useState('')
  const [locationPuedoAutorizar, setLocationPuedoAutorizar] = useState('')
  const [locationSeccion, setLocationSeccion] = useState('')
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
  const [showAsignacion, setShowAsignacion] = useState(false)
  const [grupoAsignado, setGrupoAsignado] = useState(0)
  const [usuarioGrupoList, setUsuarioGrupoList] = useState([])
  const [listadoPagosInicial, setListadoPagosInicial] = useState([])
  const [desactivarBotonModal, setDesactivarBotonModal] = useState(false)

  useEffect(() => {
    let datosOrdenados = []
    getPendientesAutorizacionCompleto(session.id, session.api_token)
      .then((items) => {
        items.flujos.forEach((item) => {
          datosOrdenados.push({
            id_flujo: item.id_flujo,
            estado: item.estado,
            nivel: item.nivel,
            id_grupo: item.id_grupoautorizacion,
            PuedoAutorizar: item.PuedoAutorizar,
            pago: item.doc_num,
            seccion: 'Pendientes',
          })
        })
        setLocationPago(datosOrdenados[0].pago)
        setLocationPagoInicial(datosOrdenados[0].pago)
        setLocationEstado(datosOrdenados[0].estado)
        setLocationIdFlujo(datosOrdenados[0].id_flujo)
        setLocationNivel(datosOrdenados[0].nivel)
        setLocationIdGrupo(datosOrdenados[0].id_grupo)
        setLocationPuedoAutorizar(datosOrdenados[0].PuedoAutorizar)
        setLocationSeccion(datosOrdenados[0].seccion)
        setListadoPagosInicial(datosOrdenados)
      })
      .then(() => {
        setListadoPagosInicial(datosOrdenados)
      })
  }, [])

  useEffect(() => {
    let mounted = true
    if (listadoPagosInicial.length > 0) {
      let listaPagos = listadoPagosInicial
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
      if (locationEstado == 10) {
        setMostrarPausado(false)
        setMostrarActualizar(true)
      } else {
        setMostrarPausado(true)
        setMostrarActualizar(false)
      }

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
          setMostrarRevision(false)
          setOcultarBotones(false)
          setOcultarBotones(false)
          setMostrarAutorizar(false)
          setMostrarAsignacion(false)
          for (let item of items.detalle) {
            if ('Revisar' == item.descripcion && (locationNivel < 5 || locationNivel > 9)) {
              setMostrarRevision(true)
            }
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
        .then(() =>
          getUsuarios(locationIdGrupo, locationIdFlujo, null, null, session.api_token)
            .then((items) => {
              if (mounted) {
                setListUsuarios(items.users)
              }
            })
            .then(() => setkeyChat(keyChat + 1)),
        )
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
    }
    return () => (mounted = false)
  }, [actualizarDatos, listadoPagosInicial])

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
      const respuesta = await postSesionUsuario(idUsuario, null, null, '2', session.api_token)
      if (respuesta === 'OK') {
        clear()
        history.push('/')
      }
    } else {
      setShow(false)
    }
  }

  /* function SeleccionarParaAutorizar(id_flujo_, estado_, nivel_) {
    sessionStorage.setItem(id_flujo_ + '|' + estado_ + '|' + nivel_, 'true')
    setDesBotonSeleccionar(true)
  } */

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
    } else if (opcion == 44) {
      setIdFlujo(id_flujo)
      setOpcion(opcion)
      setMensaje('Está seguro de trasladar el pago a no visado?')
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
    setDesactivarBotonModal(true)
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    let pagos = []
    pagos.push(id_flujo)
    if (opcion === 1) {
      if (locationEstado == 3) {
        const respuesta = await postFlujos(
          id_flujo,
          '1',
          '',
          '',
          null,
          idUsuario,
          session.api_token,
        )
        const aprobado = await postFlujoDetalle(
          id_flujo,
          '4',
          idUsuario,
          'Aprobado',
          '1',
          session.api_token,
        )
        if (respuesta == 'OK' && aprobado == 'OK') {
          history.go(-1)
        }
      } else if (locationEstado == 4) {
        const respuesta = await postFlujos(
          id_flujo,
          locationNivel,
          '',
          '',
          null,
          idUsuario,
          session.api_token,
        )
        if (respuesta == 'OK') {
          const aprobado = await postFlujoDetalle(
            id_flujo,
            '4',
            idUsuario,
            'Aprobado',
            locationNivel,
            session.api_token,
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
            locationNivel,
            session.api_token,
          )
          if (finalizado == 'OK') {
            const enviada = await postNotificacion(
              pagos,
              idUsuario,
              'autorizado por completo.',
              '',
              session.api_token,
            )
            if (enviada == 'OK') {
              history.go(-1)
            }
          }
        }
      }
    } else if (opcion == 2) {
      const respuesta = await postFlujos(id_flujo, '', '', '1', null, idUsuario, session.api_token)
      const rechazado = await postFlujoDetalle(
        id_flujo,
        '6',
        idUsuario,
        'Rechazado',
        '0',
        session.api_token,
      )
      if (respuesta == 'OK' && rechazado == 'OK') {
        const enviada = await postNotificacion(
          pagos,
          idUsuario,
          'rechazado.',
          '',
          session.api_token,
        )
        if (enviada == 'OK') {
          history.go(-1)
        }
      }
    } else if (opcion == 3) {
      setShow(true)
    } else if (opcion == 4) {
      setMostrarPausado(false)
      const respuestaPausado = await postFlujos(
        id_flujo,
        '0',
        '',
        '4',
        null,
        idUsuario,
        session.api_token,
      )
      const detalleFlujoActualizado = await postFlujoDetalle(
        id_flujo,
        '10',
        idUsuario,
        'Pausado',
        '0',
        session.api_token,
      )
      if (respuestaPausado == 'OK' && detalleFlujoActualizado == 'OK') {
        setMostrarActualizar(true)
        setMostrarAutorizar(false)
        setllaveBitacora(llaveBitacora + 1)
      } else {
        setMostrarPausado(true)
      }
    } else if (opcion == 44) {
      setMostrarPausado(false)
      setMostrarAutorizar(false)
      const respuestaPausado = await postFlujos(
        id_flujo,
        '0',
        '',
        '44',
        null,
        idUsuario,
        session.api_token,
      )
      const detalleFlujoActualizado = await postFlujoDetalle(
        id_flujo,
        '14',
        idUsuario,
        'Trasladado a no visado',
        '0',
        session.api_token,
      )
      if (respuestaPausado == 'OK' && detalleFlujoActualizado == 'OK') {
        history.go(-1)
      }
    } else if (opcion == 5) {
      const respuestaActualizado = await postFlujos(
        id_flujo,
        '0',
        '',
        '5',
        null,
        idUsuario,
        session.api_token,
      )
      const detalleFlujoActualizado = await postFlujoDetalle(
        id_flujo,
        '11',
        idUsuario,
        'Actualizado',
        '0',
        session.api_token,
      )
      if (respuestaActualizado == 'OK' && detalleFlujoActualizado == 'OK') {
        const respuestaReset = await postFlujos(
          id_flujo,
          '0',
          '',
          '6',
          null,
          idUsuario,
          session.api_token,
        )
        const detalleFlujoReset = await postFlujoDetalle(
          id_flujo,
          '3',
          idUsuario,
          'Reinicio de autorización por actualización',
          '0',
          session.api_token,
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
        session.api_token,
      )
      if (detalleFlujoActualizado == 'OK') {
        const respuestaReset = await postFlujos(
          id_flujo,
          '0',
          '',
          '7',
          null,
          idUsuario,
          session.api_token,
        )
        if (respuestaReset == 'OK') {
          history.go(-1)
        }
      }
    }
    setDesactivarBotonModal(false)
  }

  /* const MostrarAsignacionGrupo = (event) => {
    if (event.target.value != 0) {
      setIdFlujo(locationIdFlujo)
      setShowAsignacion(true)
      setGrupoAsignado(event.target.value)
    }
  } */

  async function CancelarAsignacion() {
    setShowAsignacion(false)
    setGrupoAsignado(0)
  }

  async function AsignarGrupo() {
    setDesactivarBotonModal(true)
    const respuesta = await postFlujos(
      idFlujo,
      '',
      grupoAsignado,
      '',
      null,
      session.id,
      session.api_token,
    )
    if (respuesta === 'OK') {
      const answer = await postFlujoDetalle(
        idFlujo,
        '3',
        session.id,
        'Asignado a responsable',
        '0',
        session.api_token,
      )
      if (answer === 'OK') {
        let GrupoEncontrado = usuarioGrupoList.find(
          (x) => x.id_grupoautorizacion == grupoAsignado && x.nivel == 1,
        )
        let listaPagos
        if (locationSeccion == 'Pendientes') {
          listaPagos = JSON.parse(sessionStorage.getItem('listaPagos'))
        }
        if (locationSeccion == 'Autorizados') {
          listaPagos = JSON.parse(sessionStorage.getItem('listaPagosAutorizados'))
        }
        if (locationSeccion == 'Rechazados') {
          listaPagos = JSON.parse(sessionStorage.getItem('listaPagosRechazados'))
        }
        if (locationSeccion == 'Cancelados') {
          listaPagos = JSON.parse(sessionStorage.getItem('listaPagosCancelados'))
        }
        if (locationSeccion == 'Reemplazos') {
          listaPagos = JSON.parse(sessionStorage.getItem('listaPagosReemplazos'))
        }
        if (locationSeccion == 'Notificaciones') {
          listaPagos = JSON.parse(sessionStorage.getItem('listaPagosNotificaciones'))
        }
        if (locationSeccion == 'Mensajes') {
          listaPagos = JSON.parse(sessionStorage.getItem('listaPagosMensajes'))
        }
        let objIndex = listaPagos.findIndex((obj) => obj.id_flujo == idFlujo)
        listaPagos[objIndex].estado = 3
        listaPagos[objIndex].id_grupo = grupoAsignado

        if (GrupoEncontrado !== undefined) {
          setLocationPuedoAutorizar(1)
          listaPagos[objIndex].PuedoAutorizar = 1
        }
        setLocationEstado(3)
        setLocationIdGrupo(grupoAsignado)

        if (locationSeccion == 'Pendientes') {
          sessionStorage.setItem('listaPagos', JSON.stringify(listaPagos))
        }
        if (locationSeccion == 'Autorizados') {
          sessionStorage.setItem('listaPagosAutorizados', JSON.stringify(listaPagos))
        }
        if (locationSeccion == 'Rechazados') {
          sessionStorage.setItem('listaPagosRechazados', JSON.stringify(listaPagos))
        }
        if (locationSeccion == 'Cancelados') {
          sessionStorage.setItem('listaPagosCancelados', JSON.stringify(listaPagos))
        }
        if (locationSeccion == 'Reemplazos') {
          sessionStorage.setItem('listaPagosReemplazos', JSON.stringify(listaPagos))
        }
        if (locationSeccion == 'Notificaciones') {
          sessionStorage.setItem('listaPagosNotificaciones', JSON.stringify(listaPagos))
        }
        if (locationSeccion == 'Mensajes') {
          sessionStorage.setItem('listaPagosMensajes', JSON.stringify(listaPagos))
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
    }
    setDesactivarBotonModal(false)
  }

  if (session) {
    if (locationIdFlujo) {
      if (locationEstado > 2 && locationEstado < 5) {
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
                  disabled={desactivarBotonModal}
                  color="primary"
                  onClick={() => Aprobar_Rechazar(idFlujo, opcion).then(() => Cancelar(1))}
                >
                  Aceptar
                </CButton>
              </Modal.Footer>
            </Modal>
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
                  {/* <Button variant="primary" size="sm" onClick={() => history.goBack()}>
                    <FaArrowLeft />
                    &nbsp;&nbsp;Regresar
                  </Button> */}
                </div>
                <div
                  style={{ width: '75%', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}
                  className={ocultarBotones ? 'd-none' : ''}
                >
                  <div
                    className={
                      !MostrarAutorizar && !yaAutorizo ? 'd-none float-right' : 'float-right'
                    }
                  >
                    <CButton
                      className={!MostrarAprobarRechazar ? 'd-none' : ''}
                      color="success"
                      size="sm"
                      onClick={() => mostrarModal(locationIdFlujo, 1)}
                    >
                      Aprobar
                    </CButton>{' '}
                    <CButton
                      className={!MostrarAprobarRechazar ? 'd-none' : ''}
                      color="danger"
                      size="sm"
                      onClick={() => mostrarModal(locationIdFlujo, 2)}
                    >
                      Rechazar
                    </CButton>
                  </div>
                  {/* <div className={!MostrarRevision ? 'd-none float-right' : 'float-right'}>
                    <CButton
                      className={!MostrarPausado ? 'd-none' : ''}
                      color="danger"
                      size="sm"
                      onClick={() => mostrarModal(locationIdFlujo, 4)}
                    >
                      Pausar
                    </CButton>{' '}
                    <CButton
                      className={!MostrarPausado ? 'd-none' : ''}
                      color="primary"
                      size="sm"
                      onClick={() => mostrarModal(locationIdFlujo, 44)}
                    >
                      No visado
                    </CButton>{' '}
                    <CButton
                      className={!MostrarActualizar ? 'd-none' : ''}
                      color="primary"
                      size="sm"
                      onClick={() => mostrarModal(locationIdFlujo, 5)}
                    >
                      Actualizar y reiniciar
                    </CButton>{' '}
                    <CButton
                      className={!MostrarActualizar ? 'd-none' : ''}
                      color="info"
                      size="sm"
                      onClick={() => mostrarModal(locationIdFlujo, 55)}
                    >
                      Actualizar y continuar
                    </CButton>
                  </div> */}
                </div>
              </div>
              <div
                style={{ width: '20%', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}
              >
                {/* <div className={ocultarBotones ? 'd-none' : ''}>
                  <div className={!MostrarAutorizar && !yaAutorizo ? 'd-none' : ''}>
                    <Button
                      variant="warning"
                      size="sm"
                      title="Seleccionar"
                      className={!MostrarAprobarRechazar ? 'd-none' : ''}
                      onClick={() =>
                        SeleccionarParaAutorizar(locationIdFlujo, locationEstado, locationNivel)
                      }
                      disabled={desBotonSeleccionar}
                    >
                      Marcar para autorizar
                    </Button>
                  </div>
                </div> */}
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
              <div
                style={{ marginTop: '10px', width: '70%', display: 'flex', alignItems: 'center' }}
              >
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
            <Chat
              style={{ zIndex: 1 }}
              key={keyChat}
              id_usuario={session.id}
              id_flujo={locationIdFlujo}
              pago={locationPago}
              id_grupo={grupo}
              token={session.api_token}
              prioridad_usuario={resultsPrioridad}
              lista_usuarios={usuarios}
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
                  disabled={desactivarBotonModal}
                  color="primary"
                  onClick={() => Aprobar_Rechazar(idFlujo, opcion).then(() => Cancelar(1))}
                >
                  Aceptar
                </CButton>
              </Modal.Footer>
            </Modal>
            <Modal responsive show={showAsignacion} onHide={() => CancelarAsignacion()} centered>
              <Modal.Header closeButton>
                <Modal.Title>Confirmación</Modal.Title>
              </Modal.Header>
              <Modal.Body>Está seguro de asignar el grupo seleccionado al pago?</Modal.Body>
              <Modal.Footer>
                <CButton color="secondary" onClick={() => CancelarAsignacion()}>
                  Cancelar
                </CButton>
                <CButton
                  disabled={desactivarBotonModal}
                  color="primary"
                  onClick={() => AsignarGrupo().then(() => CancelarAsignacion())}
                >
                  Aceptar
                </CButton>
              </Modal.Footer>
            </Modal>
            <div
              style={{
                display: 'flex',
                gap: '10px',
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}
            >
              <div
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  width: '50%',
                  paddingTop: '10px',
                  marginLeft: '10px',
                }}
              >
                {/* <Button variant="primary" size="sm" onClick={() => history.goBack()}>
                  <FaArrowLeft />
                  &nbsp;&nbsp;Regresar
                </Button> */}
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  paddingTop: '10px',
                  marginRight: '10px',
                  width: '50%',
                  maxHeight: '41.5px',
                }}
              >
                {/* <div
                  className={
                    MostrarAsignacion && locationEstado == 2 ? 'float-right' : 'd-none float-right'
                  }
                >
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FaUsers />
                    </CInputGroupText>
                    <CFormSelect name="grupo_autorizacion" onChange={MostrarAsignacionGrupo}>
                      <option value="0">Seleccione un grupo de autorización.</option>
                      {gruposList.map((item, i) => {
                        if (item.eliminado == 0 && item.activo == 1) {
                          return (
                            <option key={item.id_grupo} value={item.id_grupo}>
                              {item.identificador}
                            </option>
                          )
                        }
                      })}
                    </CFormSelect>
                  </CInputGroup>
                </div> */}
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
              <div
                style={{ marginTop: '10px', width: '70%', display: 'flex', alignItems: 'center' }}
              >
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
            <Chat
              style={{ zIndex: 1 }}
              key={keyChat}
              id_usuario={session.id}
              id_flujo={locationIdFlujo}
              pago={locationPago}
              id_grupo={grupo}
              token={session.api_token}
              prioridad_usuario={resultsPrioridad}
              lista_usuarios={usuarios}
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

export default PagoTabsCompleto
