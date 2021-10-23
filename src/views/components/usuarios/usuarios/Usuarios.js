import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { postEditarUsuario } from '../../../../services/postEditarUsuario'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { getUsuarios } from '../../../../services/getUsuarios'
import { useSession } from 'react-use-session'
import { FaUserEdit, FaTrash, FaUserCog, FaUserCircle, FaUsersCog } from 'react-icons/fa'
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

const Usuarios = () => {
  const history = useHistory()
  const { session, clear } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])
  const [show, setShow] = useState(false)
  const [idUsuario, setIdUsuario] = useState(0)
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    let mounted = true
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getUsuarios(null, null, null, null).then((items) => {
      if (mounted) {
        setList(items.users)
      }
    })
    getPerfilUsuario(idUsuario, '2').then((items) => {
      if (mounted) {
        setPermisos(items.detalle)
      }
    })
    window.addEventListener('beforeunload', (ev) => {
      console.log(ev)
      ev.preventDefault()
      return (ev.returnValue = 'Esta seguro de cerrar sesión?')
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

  function mostrarModal(id, nombre, opcion) {
    setIdUsuario(id)
    setOpcion(opcion)
    setShow(true)
    setMensaje('Está seguro de eliminar al usuario ' + nombre + '?')
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
    }
  }

  async function eliminarUsuario(id, opcion) {
    if (opcion == 1) {
      const respuesta = await postEditarUsuario(id, '', '', '', '', '', '2')
      if (respuesta === 'OK') {
        await getUsuarios(null, null, null, null).then((items) => {
          setList(items.users)
        })
      }
    } else if (opcion == 2) {
      setShow(false)
    }
  }

  const handleOnIdle = (event) => {
    setShow(true)
    setOpcion(2)
    setMensaje(
      'Ya estuvo mucho tiempo sin realizar ninguna acción. Si desea continuar presione aceptar.',
    )
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
    let deshabilitar_grupo = false
    if (ExistePermiso('Modulo Usuarios')) {
      deshabilitar_grupo = true
    }
    if (ExistePermiso('Modulo Grupos Autorizacion')) {
      deshabilitar = true
    }
    if (ExistePermiso('Modulo Usuarios') && ExistePermiso('Modulo Grupos Autorizacion')) {
      deshabilitar = false
      deshabilitar_grupo = false
    }
    if (!ExistePermiso('Modulo Usuarios') && !ExistePermiso('Modulo Grupos Autorizacion')) {
      deshabilitar_grupo = true
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
              onClick={() => eliminarUsuario(idUsuario, opcion).then(() => Cancelar(1))}
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
            onClick={() => history.push('/usuarios/registro')}
          >
            Crear Nuevo
          </CButton>
        </div>
        <CTable hover responsive align="middle" className="mb-0 border">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell className="text-center">Nombre</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Correo</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Usuario</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Estado</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {results.map((item, i) => {
              let estado = 'Inactivo'
              if (item.eliminado == 0 && item.id !== session.id) {
                if (item.activo == 1) {
                  estado = 'Activo'
                }
                return (
                  <CTableRow key={item.id}>
                    <CTableDataCell className="text-center">
                      {item.nombre} {item.apellido}
                    </CTableDataCell>
                    <CTableDataCell className="text-center">{item.email}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.nombre_usuario}</CTableDataCell>
                    <CTableDataCell className="text-center">{estado}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton
                        color="info"
                        size="sm"
                        title="Consultar Usuario Perfil"
                        disabled={deshabilitar}
                        onClick={() =>
                          history.push({
                            pathname: '/usuarios/consulta',
                            id_usuario: item.id,
                            email: item.email,
                            nombre: item.nombre + ' ' + item.apellido,
                            estado: item.activo,
                          })
                        }
                      >
                        <FaUserCircle />
                      </CButton>{' '}
                      <CButton
                        color="success"
                        size="sm"
                        title="Asignar Perfiles"
                        disabled={deshabilitar}
                        onClick={() =>
                          history.push({
                            pathname: '/usuarios/perfilusuario',
                            id: item.id,
                            nombre: item.nombre + ' ' + item.apellido,
                            email: item.email,
                            estado: item.activo,
                          })
                        }
                      >
                        <FaUserCog />
                      </CButton>{' '}
                      <CButton
                        color="warning"
                        size="sm"
                        title="Asignar Grupo Autorización"
                        disabled={deshabilitar_grupo}
                        onClick={() =>
                          history.push({
                            pathname: '/usuarios/usuariogrupo',
                            id_usuario: item.id,
                            nombre: item.nombre + ' ' + item.apellido,
                            email: item.email,
                            estado: item.activo,
                            inhabilitar: true,
                          })
                        }
                      >
                        <FaUsersCog />
                      </CButton>{' '}
                      <CButton
                        color="primary"
                        size="sm"
                        title="Editar Usuario"
                        disabled={deshabilitar}
                        onClick={() =>
                          history.push({
                            pathname: '/usuarios/editar',
                            id: item.id,
                            nombre: item.nombre,
                            apellido: item.apellido,
                            usuario: item.nombre_usuario,
                            email: item.email,
                            password: item.password,
                            estado: item.activo,
                          })
                        }
                      >
                        <FaUserEdit />
                      </CButton>{' '}
                      <CButton
                        color="danger"
                        size="sm"
                        title="Eliminar Usuario"
                        disabled={deshabilitar}
                        onClick={() => mostrarModal(item.id, item.nombre + ' ' + item.apellido, 1)}
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
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default Usuarios
