import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { getGruposAutorizacion } from '../../../../services/getGruposAutorizacion'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { postGruposAutorizacion } from '../../../../services/postGruposAutorizacion'
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

const GruposAutorizacion = () => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])
  const [show, setShow] = useState(false)
  const [idGrupo, setIdGrupo] = useState(0)
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    let mounted = true
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getGruposAutorizacion(null, null).then((items) => {
      if (mounted) {
        setList(items.grupos)
      }
    })
    getPerfilUsuario(idUsuario, '2').then((items) => {
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

  function mostrarModal(id_grupo, nombre, opcion) {
    setIdGrupo(id_grupo)
    setOpcion(opcion)
    setMensaje('Está seguro de eliminar el grupo ' + nombre + '?')
    setShow(true)
  }

  async function eliminarGrupo(id_grupo, opcion) {
    if (opcion == 1) {
      const respuesta = await postGruposAutorizacion(id_grupo, '', '', '', '', '2')
      if (respuesta === 'OK') {
        await getGruposAutorizacion(null, null).then((items) => {
          setList(items.grupos)
        })
      }
    } else if (opcion == 2) {
      setShow(false)
      detener()
    }
  }

  if (session) {
    let deshabilitar = false
    if (ExistePermiso('Modulo Grupos Autorizacion') == 0) {
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
              onClick={() => eliminarGrupo(idGrupo, opcion).then(() => Cancelar(1))}
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
            onClick={() => history.push('/grupos/nuevo')}
          >
            Crear Nuevo
          </CButton>
        </div>
        <CTable hover responsive align="middle" className="mb-0 border">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell className="text-center">Grupo Autorización</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Niveles</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Descripcion</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Estado</CTableHeaderCell>
              <CTableHeaderCell style={{ textAlign: 'center', width: '15%' }}>
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
                  <CTableRow key={item.id_grupo}>
                    <CTableDataCell className="text-center">{item.identificador}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.numero_niveles}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.descripcion}</CTableDataCell>
                    <CTableDataCell className="text-center">{estado}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton
                        color="primary"
                        size="sm"
                        title="Editar Grupo Autorización"
                        disabled={deshabilitar}
                        onClick={() =>
                          history.push({
                            pathname: '/grupos/editar',
                            id_grupo: item.id_grupo,
                            numero_niveles: item.numero_niveles,
                            identificador: item.identificador,
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
                        title="Eliminar Grupo Autorización"
                        disabled={deshabilitar}
                        onClick={() => mostrarModal(item.id_grupo, item.identificador, 1)}
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

export default GruposAutorizacion
