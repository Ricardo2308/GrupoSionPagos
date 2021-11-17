import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { postPerfilUsuario } from '../../../../services/postPerfilUsuario'
import { useSession } from 'react-use-session'
import { FaTrash, FaPen, FaUsersCog } from 'react-icons/fa'
import { BsToggles } from 'react-icons/bs'
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

const Consultar = () => {
  const history = useHistory()
  const location = useLocation()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])
  const [show, setShow] = useState(false)
  const [idPerfil, setIdPerfil] = useState(0)
  const [estado, setEstado] = useState(0)
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    let mounted = true
    let objeto = 'Modulo Usuarios'
    let idUsuario1 = 0
    let idUsuario2 = 0
    if (location.id_usuario) {
      idUsuario1 = location.id_usuario
    }
    if (session) {
      idUsuario2 = session.id
    }
    getPerfilUsuario(idUsuario1, '1', '0').then((items) => {
      if (mounted) {
        setList(items.detalle)
      }
    })
    getPerfilUsuario(idUsuario2, '2', objeto).then((items) => {
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

  function iniciar(minutos) {
    let segundos = 60 * minutos
    const intervalo = setInterval(() => {
      segundos--
      if (segundos == 0) {
        Cancelar(3)
      }
    }, 1000)
    setTime(intervalo)
  }

  function detener() {
    clearInterval(time)
  }

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

  function mostrarModal(id_perfil, opcion, estado) {
    if (opcion == 1) {
      setMensaje('Está seguro de eliminar este perfil?')
      setIdPerfil(id_perfil)
      setOpcion(opcion)
      setShow(true)
    } else if (opcion == 2) {
      setMensaje('Está seguro de cambiar el estado de este perfil?')
      setIdPerfil(id_perfil)
      setEstado(estado)
      setOpcion(opcion)
      setShow(true)
    }
  }

  async function crudPerfil(id_usuario, id_usuarioperfil, opcion, estado) {
    let result
    if (opcion == 1) {
      const respuesta = await postPerfilUsuario(id_usuarioperfil, '', '', '1', '', '')
      if (respuesta === 'OK') {
        await getPerfilUsuario(id_usuario, '1').then((items) => {
          setList(items.detalle)
        })
      }
    } else if (opcion == 2) {
      if (estado == 0) {
        result = '1'
      } else {
        result = '0'
      }
      const respuesta = await postPerfilUsuario(id_usuarioperfil, '', '', '3', '', result)
      if (respuesta === 'OK') {
        await getPerfilUsuario(id_usuario, '1').then((items) => {
          setList(items.detalle)
        })
      }
    } else if (opcion == 3) {
      setShow(false)
      detener()
    }
  }

  if (session) {
    if (location.id_usuario) {
      let deshabilitar = false
      if (!ExistePermiso('Modulo Usuarios')) {
        deshabilitar = true
      }
      return (
        <>
          <Modal variant="primary" show={show} onHide={() => Cancelar(opcion)} centered>
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
                onClick={() =>
                  crudPerfil(location.id_usuario, idPerfil, opcion, estado).then(() => Cancelar(1))
                }
              >
                Aceptar
              </CButton>
            </Modal.Footer>
          </Modal>
          <div className="user-name-profile">
            {location.nombre}{' '}
            <CButton
              color="warning"
              size="sm"
              title="Asignar Grupo Autorización"
              disabled={deshabilitar}
              onClick={() =>
                history.push({
                  pathname: '/usuarios/usuariogrupo',
                  id_usuario: session.id,
                  nombre: session.name,
                  email: session.email,
                  estado: session.estado,
                })
              }
            >
              <FaUsersCog />
            </CButton>
          </div>
          <CTable hover responsive align="middle" className="mb-0 border">
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell style={{ textAlign: 'center', width: '40%' }}>
                  Nombre Perfil
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center">Estado Usuario Perfil</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Acciones</CTableHeaderCell>
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
                    <CTableRow key={item.id_usuario}>
                      <CTableDataCell style={{ textAlign: 'center', width: '40%' }}>
                        {item.descripcion}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">{estado}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton
                          color="primary"
                          size="sm"
                          title="Cambiar Perfil"
                          disabled={deshabilitar}
                          onClick={() =>
                            history.push({
                              pathname: '/usuarios/editarPU',
                              id_usuarioperfil: item.id_usuarioperfil,
                              id_usuario: item.id_usuario,
                              id_perfil: item.id_perfil,
                              nombre: location.nombre,
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
                          title="Eliminar Perfil Asociado"
                          disabled={deshabilitar}
                          onClick={() => mostrarModal(item.id_usuarioperfil, 1, '')}
                        >
                          <FaTrash />
                        </CButton>{' '}
                        <CButton
                          color="info"
                          size="sm"
                          title="Cambiar Estado"
                          disabled={deshabilitar}
                          onClick={() => mostrarModal(item.id_usuarioperfil, 2, item.activo)}
                        >
                          <BsToggles />
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
      history.push('/usuarios')
      return (
        <div className="sin-sesion">
          NO SE CARGÓ EL CÓDIGO DEL USUARIO. REGRESE A LA PANTALLA DE USUARIOS.
        </div>
      )
    }
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default Consultar
