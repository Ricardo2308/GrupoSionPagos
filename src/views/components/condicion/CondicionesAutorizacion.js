import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSession } from 'react-use-session'
import { Modal } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { FaPen, FaTrash, FaUsersCog, FaUsers } from 'react-icons/fa'
import { getCondicionesAutorizacion } from '../../../services/getCondicionesAutorizacion'
import { getPerfilUsuario } from '../../../services/getPerfilUsuario'
import { postCondicionAutorizacion } from '../../../services/postCondicionAutorizacion'
import { postSesionUsuario } from '../../../services/postSesionUsuario'
import '../../../scss/estilos.scss'
import {
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

const Cards = () => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])
  const [show, setShow] = useState(false)
  const [idCondicion, setIdCondicion] = useState(0)
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    let mounted = true
    let objeto = 'Modulo Condiciones'
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getCondicionesAutorizacion(null, null).then((items) => {
      if (mounted) {
        setList(items.condiciones)
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
    let result = false
    for (let item of permisos) {
      if (objeto === item.objeto) {
        result = true
      }
    }
    return result
  }

  function mostrarModal(id_condicion, opcion) {
    setOpcion(opcion)
    setIdCondicion(id_condicion)
    setMensaje('Está seguro de eliminar esta condición de autorización?')
    setShow(true)
  }

  async function eliminarCondicion(id_condicion, opcion) {
    if (opcion == 1) {
      const respuesta = await postCondicionAutorizacion(id_condicion, '', '', '', '2')
      if (respuesta === 'OK') {
        await getCondicionesAutorizacion(null, null).then((items) => {
          setList(items.condiciones)
        })
      }
    } else if (opcion == 2) {
      setShow(false)
      detener()
    }
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

  if (session) {
    let deshabilitar = false
    if (!ExistePermiso('Modulo Condiciones')) {
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
              onClick={() => eliminarCondicion(idCondicion, opcion).then(() => Cancelar(1))}
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
            onClick={() => history.push('/condiciones/nueva')}
          >
            Crear Nueva
          </CButton>
        </div>
        <CTable hover responsive align="middle" className="mb-0 border">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell style={{ textAlign: 'center', width: '45%' }}>
                Descripción
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center">Parámetro</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Estado</CTableHeaderCell>
              <CTableHeaderCell style={{ textAlign: 'center', width: '20%' }}>
                Acciones
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {results.map((item, i) => {
              let estado = 'Inactivo'
              if (item.eliminado == 0) {
                if (item.activo == 1) {
                  estado = 'Activo'
                }
                return (
                  <CTableRow key={item.id_condicionautorizacion}>
                    <CTableDataCell className="text-center">{item.descripcion}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.parametro}</CTableDataCell>
                    <CTableDataCell className="text-center">{estado}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton
                        color="info"
                        size="sm"
                        title="Consultar Condición Grupos"
                        disabled={deshabilitar}
                        onClick={() =>
                          history.push({
                            pathname: '/condiciones/consulta',
                            id_condicion: item.id_condicionautorizacion,
                            descripcion: item.descripcion,
                            estado: estado,
                          })
                        }
                      >
                        <FaUsers />
                      </CButton>{' '}
                      <CButton
                        color="success"
                        size="sm"
                        title="Asignar Grupo Autorización"
                        disabled={deshabilitar}
                        onClick={() =>
                          history.push({
                            pathname: '/condiciones/condiciongrupo',
                            id_condicion: item.id_condicionautorizacion,
                            descripcion: item.descripcion,
                            estado: item.activo,
                          })
                        }
                      >
                        <FaUsersCog />
                      </CButton>{' '}
                      <CButton
                        color="primary"
                        size="sm"
                        title="Editar Condición Autorización"
                        disabled={deshabilitar}
                        onClick={() =>
                          history.push({
                            pathname: '/condiciones/editar',
                            id_condicion: item.id_condicionautorizacion,
                            descripcion: item.descripcion,
                            parametro: item.parametro,
                            estado: item.activo,
                          })
                        }
                      >
                        <FaPen />
                      </CButton>{' '}
                      <CButton
                        color="danger"
                        size="sm"
                        title="Eliminar Condición Autorización"
                        disabled={deshabilitar}
                        onClick={() => mostrarModal(item.id_condicionautorizacion, 1)}
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

export default Cards
