import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import { getSesionUsuario } from '../../../../services/getSesionUsuario'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { useSession } from 'react-use-session'
import { useIdleTimer } from 'react-idle-timer'
import '../../../../scss/estilos.scss'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
} from '@coreui/react'

const Historico = () => {
  const history = useHistory()
  const location = useLocation()
  const { session, clear } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [results, setList] = useState([])
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    let mounted = true
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    if (location.IdUsuario) {
      idUsuario = location.IdUsuario
    }
    getSesionUsuario(location.IdUsuario).then((items) => {
      if (mounted) {
        setList(items.sesiones)
      }
    })
    return () => (mounted = false)
  }, [])

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

  const handleOnIdle = (event) => {
    setShow(true)
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
    if (location.IdUsuario) {
      return (
        <>
          <Modal responsive variant="primary" show={show} onHide={() => Cancelar(2)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Confirmación</Modal.Title>
            </Modal.Header>
            <Modal.Body>{mensaje}</Modal.Body>
            <Modal.Footer>
              <CButton color="secondary" onClick={() => Cancelar(2)}>
                Cancelar
              </CButton>
              <CButton color="primary" onClick={() => Cancelar(1)}>
                Aceptar
              </CButton>
            </Modal.Footer>
          </Modal>
          <div className="user-name-profile">{location.NombreUsuario}</div>
          <CTable hover responsive align="middle" className="mb-0 border">
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell className="text-center">Navegador</CTableHeaderCell>
                <CTableHeaderCell className="text-center">IP Usuario</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Inicio Sesión</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Fin Sesión</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {results.map((item, i) => {
                return (
                  <CTableRow key={item.IdSesion}>
                    <CTableDataCell className="text-center">{item.Navegador}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.IPAddress}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.FechaHoraInicio}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.FechaHoraFinal}</CTableDataCell>
                  </CTableRow>
                )
              })}
            </CTableBody>
          </CTable>
        </>
      )
    } else {
      history.push('/conectados')
      return (
        <div className="sin-sesion">
          NO SE CARGÓ EL CÓDIGO DEL USUARIO. REGRESE A LA PANTALLA DE USUARIOS.
        </div>
      )
    }
  } else {
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default Historico
