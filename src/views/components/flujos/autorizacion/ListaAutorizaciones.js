import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { getUsuarioAutorizacion } from '../../../../services/getUsuarioAutorizacion'
import { postUsuarioAutorizacion } from '../../../../services/postUsuarioAutorizacion'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { useSession } from 'react-use-session'
import { useHistory } from 'react-router-dom'
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

const ListaAutorizaciones = () => {
  const history = useHistory()
  const { session, clear } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])
  const [show, setShow] = useState(false)
  const [idAutorizacion, setidAutorizacion] = useState(0)
  const [estado, setEstado] = useState(0)
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    let mounted = true
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getUsuarioAutorizacion(idUsuario, null).then((items) => {
      if (mounted) {
        setList(items.autorizacion)
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

  function mostrarModal(id_autorizacion, opcion, estado) {
    setidAutorizacion(id_autorizacion)
    setEstado(estado)
    setOpcion(opcion)
    setShow(true)
    setMensaje('Está seguro de cambiar el estado de la autorización de encargado temporal?')
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

  async function cambiarEstado(id_autorizacion, opcion, estado) {
    if (opcion == 1) {
      let result
      if (estado == 0) {
        result = '1'
      } else {
        result = '0'
      }
      const respuesta = await postUsuarioAutorizacion(
        id_autorizacion,
        '',
        '',
        '',
        '',
        opcion,
        result,
      )
      if (respuesta === 'OK') {
        await getUsuarioAutorizacion(session.id, null).then((items) => {
          setList(items.autorizacion)
        })
      }
    } else if (opcion == 2) {
      setShow(false)
    }
  }

  if (session) {
    let deshabilitar = false
    if (ExistePermiso('Modulo Autorizacion') == 0) {
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
              onClick={() => cambiarEstado(idAutorizacion, opcion, estado).then(() => Cancelar(1))}
            >
              Aceptar
            </CButton>
          </Modal.Footer>
        </Modal>
        <div className="float-right" style={{ marginBottom: '10px' }}>
          <CButton
            color="primary"
            size="sm"
            //disabled={deshabilitar}
            onClick={() =>
              history.push({
                pathname: '/autorizacion/nueva',
                id_usuario: session.id,
              })
            }
          >
            Crear Nueva
          </CButton>
        </div>
        <CTable hover responsive align="middle" className="mb-0 border">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell className="text-center">Usuario Temporal</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Fecha Inicio</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Fecha Final</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Estado</CTableHeaderCell>
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
                  <CTableRow key={item.id_usuarioautorizacion}>
                    <CTableDataCell className="text-center">{item.usuariotemporal}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.fecha_inicio}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.fecha_final}</CTableDataCell>
                    <CTableDataCell className="text-center">{estado}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton
                        color="info"
                        size="sm"
                        title="Cambiar Estado"
                        //disabled={deshabilitar}
                        onClick={() => mostrarModal(item.id_usuarioautorizacion, 1, item.activo)}
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
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default ListaAutorizaciones
