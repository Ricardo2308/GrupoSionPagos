import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useIdleTimer } from 'react-idle-timer'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { getSesionUsuario } from '../../../../services/getSesionUsuario'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { useSession } from 'react-use-session'
import { FaList } from 'react-icons/fa'
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

const Conectados = () => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])
  const [show, setShow] = useState(false)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    let mounted = true
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getSesionUsuario(null).then((items) => {
      if (mounted) {
        setList(items.sesiones)
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
    let result = false
    for (let item of permisos) {
      if (objeto === item.objeto) {
        result = true
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
    if (!ExistePermiso('Modulo Conectados')) {
      deshabilitar = true
    }
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
        <CTable hover responsive align="middle" className="mb-0 border">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell className="text-center">Usuario</CTableHeaderCell>
              <CTableHeaderCell className="text-center">IP</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Navegador</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Hora Inicio</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {results.map((item, i) => {
              if (item.IdUsuario != session.id) {
                return (
                  <CTableRow key={item.IdUsuario}>
                    <CTableDataCell className="text-center">{item.NombreUsuario}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.IPAddress}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.Navegador}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.FechaHoraInicio}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton
                        color="primary"
                        size="sm"
                        title="Histórico Usuario"
                        disabled={deshabilitar}
                        onClick={() =>
                          history.push({
                            pathname: '/conectados/historico',
                            IdUsuario: item.IdUsuario,
                            NombreUsuario: item.NombreUsuario,
                          })
                        }
                      >
                        <FaList />
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

export default Conectados
