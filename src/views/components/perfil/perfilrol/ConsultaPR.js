import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { getPerfilRol } from '../../../../services/getPerfilRol'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { postPerfilRol } from 'src/services/postPerfilRol'
import { useSession } from 'react-use-session'
import { FaTrash, FaPen } from 'react-icons/fa'
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

const ConsultarPR = () => {
  const history = useHistory()
  const location = useLocation()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [show, setShow] = useState(false)
  const [idRol, setIdRol] = useState(0)
  const [estado, setEstado] = useState(0)
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    let mounted = true
    getPerfilRol(location.id_perfil, null).then((items) => {
      if (mounted) {
        setList(items.detalle)
      }
    })
    return () => (mounted = false)
  }, [])

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

  function mostrarModal(id_rol, opcion, estado) {
    if (opcion == 1) {
      setMensaje('Está seguro de eliminar este rol?')
      setIdRol(id_rol)
      setOpcion(opcion)
      setShow(true)
    } else if (opcion == 2) {
      setMensaje('Está seguro de cambiar el estado de este rol?')
      setIdRol(id_rol)
      setEstado(estado)
      setOpcion(opcion)
      setShow(true)
    }
  }

  async function crudPerfilRol(id_perfil, id_perfilrol, opcion, estado) {
    let result
    if (opcion == 1) {
      const respuesta = await postPerfilRol(id_perfilrol, '', '', '1', '', '')
      if (respuesta === 'OK') {
        await getPerfilRol(id_perfil, null).then((items) => {
          setList(items.detalle)
        })
      }
    } else if (opcion == 2) {
      if (estado == 0) {
        result = '1'
      } else {
        result = '0'
      }
      const respuesta = await postPerfilRol(id_perfilrol, '', '', '3', '', result)
      if (respuesta === 'OK') {
        await getPerfilRol(id_perfil, null).then((items) => {
          setList(items.detalle)
        })
      }
    } else if (opcion == 3) {
      setShow(false)
      detener()
    }
  }

  if (session) {
    if (location.id_perfil) {
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
                  crudPerfilRol(location.id_perfil, idRol, opcion, estado).then(() => Cancelar(1))
                }
              >
                Aceptar
              </CButton>
            </Modal.Footer>
          </Modal>
          <div
            style={{
              width: '100%',
              textAlign: 'center',
              fontWeight: 'bold',
              borderColor: 'black',
            }}
          >
            <p>{location.descripcion}</p>
          </div>
          <CTable hover responsive align="middle" className="mb-0 border">
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell className="text-center">Nombre Rol</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Estado Rol</CTableHeaderCell>
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
                      <CTableDataCell className="text-center">{item.descripcion}</CTableDataCell>
                      <CTableDataCell className="text-center">{estado}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton
                          color="primary"
                          size="sm"
                          title="Cambiar Rol"
                          onClick={() =>
                            history.push({
                              pathname: '/perfiles/editarPR',
                              id_perfilrol: item.id_perfilrol,
                              id_perfil: item.id_perfil,
                              id_rol: item.id_rol,
                              descripcion: item.descripcion,
                              nombre: location.descripcion,
                              estado: item.activo,
                            })
                          }
                        >
                          <FaPen />
                        </CButton>{' '}
                        <CButton
                          color="danger"
                          size="sm"
                          title="Eliminar Rol"
                          onClick={() => mostrarModal(item.id_perfilrol, 1, '')}
                        >
                          <FaTrash />
                        </CButton>{' '}
                        <CButton
                          color="info"
                          size="sm"
                          title="Cambiar Estado"
                          onClick={() => mostrarModal(item.id_perfilrol, 2, item.activo)}
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
      history.push('/perfiles')
      return (
        <div className="sin-sesion">
          NO SE CARGÓ EL CÓDIGO DEL PERFIL. REGRESE A LA PANTALLA DE PERFILES.
        </div>
      )
    }
  } else {
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default ConsultarPR
