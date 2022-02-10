import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { getEstadosFlujo } from '../../../../services/getEstadosFlujo'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { postEstadoFlujo } from '../../../../services/postEstadoFlujo'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { useSession } from 'react-use-session'
import { FaPen, FaTrash } from 'react-icons/fa'
import '../../../../scss/estilos.scss'
import {
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

const EstadosFlujo = () => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])
  const [show, setShow] = useState(false)
  const [idEstado, setIdEstado] = useState(0)
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    let mounted = true
    let objeto = 'Modulo Estados Pago'
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getEstadosFlujo(null, null).then((items) => {
      if (mounted) {
        setList(items.estados)
      }
    })
    getPerfilUsuario(idUsuario, '2', objeto).then((items) => {
      if (mounted) {
        setPermisos(items.detalle)
      }
    })
    return () => (mounted = false)
  }, [])

  function ExistePermiso(objeto) {
    let result = 0
    for (let item of permisos) {
      if (objeto === item.objeto) {
        result = 1
      }
    }
    return result
  }

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
    setOpcion(2)
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

  function mostrarModal(id_estado, nombre, opcion) {
    setIdEstado(id_estado)
    setOpcion(opcion)
    setShow(true)
    setMensaje('Está seguro de eliminar el estado de pago ' + nombre + '?')
  }

  async function eliminarEstado(id_estado, opcion) {
    if (opcion == 1) {
      const respuesta = await postEstadoFlujo(id_estado, '', '', '', '2')
      if (respuesta === 'OK') {
        await getEstadosFlujo(null, null).then((items) => {
          setList(items.estados)
        })
      }
    } else if (opcion == 2) {
      setShow(false)
      detener()
    }
  }

  if (session) {
    let deshabilitar = false
    if (ExistePermiso('Modulo Estados Pago') == 0) {
      deshabilitar = true
    }
    return (
      <>
        <Modal responsive variant="primary" show={show} onHide={() => Cancelar(opcion)} centered>
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
              onClick={() => eliminarEstado(idEstado, opcion).then(() => Cancelar(1))}
            >
              Aceptar
            </CButton>
          </Modal.Footer>
        </Modal>
        <div className="float-right" style={{ marginBottom: '10px' }}>
          <CButton
            color="primary"
            size="sm"
            disabled={deshabilitar}
            onClick={() => history.push('/estadosflujo/nuevo')}
          >
            Crear Nuevo
          </CButton>
        </div>
        <CTable hover responsive align="middle" className="mb-0 border">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell className="text-center">Estado Pago Destino</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Estado Flujo Origen</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Estado</CTableHeaderCell>
              <CTableHeaderCell style={{ textAlign: 'center', width: '20%' }}>
                Acciones
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {results.map((item, i) => {
              let asignacion = ''
              let estado = 'Inactivo'
              if (item.eliminado == 0) {
                if (item.activo == 1) {
                  estado = 'Activo'
                }
                if (item.id_estadoflujopadre === '' || item.id_estadoflujopadre === '0') {
                  asignacion = 'No asignado'
                } else {
                  asignacion = item.estadopadre
                }
                return (
                  <CTableRow key={item.id_estadoflujo}>
                    <CTableDataCell className="text-center">{item.descripcion}</CTableDataCell>
                    <CTableDataCell className="text-center">{asignacion}</CTableDataCell>
                    <CTableDataCell className="text-center">{estado}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton
                        color="primary"
                        size="sm"
                        title="Editar Estado Flujo"
                        disabled={deshabilitar}
                        onClick={() =>
                          history.push({
                            pathname: '/estadosflujo/editar',
                            id_estado: item.id_estadoflujo,
                            id_estadopadre: item.id_estadoflujopadre,
                            descripcion: item.descripcion,
                            estado: item.activo,
                          })
                        }
                      >
                        <FaPen />
                      </CButton>{' '}
                      <CButton
                        color="danger"
                        size="sm"
                        title="Eliminar Estado Flujo"
                        disabled={deshabilitar}
                        onClick={() => mostrarModal(item.id_estadoflujo, item.descripcion, 1)}
                      >
                        <FaTrash />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                )
              }
            })}
          </CTableBody>
        </CTable>
      </>
    )
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default EstadosFlujo
