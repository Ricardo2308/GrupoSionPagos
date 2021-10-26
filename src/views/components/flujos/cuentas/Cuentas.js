import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { getCuentas } from '../../../../services/getCuentas'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { useIdleTimer } from 'react-idle-timer'
import { useSession } from 'react-use-session'
import { FaPen } from 'react-icons/fa'
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

const Cuentas = () => {
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
    getCuentas(null, null).then((items) => {
      if (mounted) {
        console.log(items)
        setList(items.cuentas)
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
    if (ExistePermiso('Modulo Cuentas') == 0) {
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
        <div className="float-right" style={{ marginBottom: '10px' }}>
          <CButton
            color="primary"
            size="sm"
            disabled={deshabilitar}
            onClick={() => history.push('/cuentas/nueva')}
          >
            Crear Nueva
          </CButton>
        </div>
        <CTable hover responsive align="middle" className="mb-0 border">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell className="account-row">Número Cuenta</CTableHeaderCell>
              <CTableHeaderCell className="account-row">Nombre</CTableHeaderCell>
              <CTableHeaderCell className="account-row">Empresa</CTableHeaderCell>
              <CTableHeaderCell className="account-row">Banco</CTableHeaderCell>
              <CTableHeaderCell className="account-row">Moneda</CTableHeaderCell>
              <CTableHeaderCell className="account-row" style={{ width: '10%' }}>
                Código ACH
              </CTableHeaderCell>
              <CTableHeaderCell className="account-row" style={{ width: '14%' }}>
                Acciones
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {results.map((item, i) => {
              return (
                <CTableRow key={item.id_cuenta}>
                  <CTableDataCell className="account-row">{item.numero_cuenta}</CTableDataCell>
                  <CTableDataCell className="account-row">{item.nombre}</CTableDataCell>
                  <CTableDataCell className="account-row">{item.empresa}</CTableDataCell>
                  <CTableDataCell className="account-row">{item.banco}</CTableDataCell>
                  <CTableDataCell className="account-row">{item.moneda}</CTableDataCell>
                  <CTableDataCell className="account-row">{item.codigo_ach}</CTableDataCell>
                  <CTableDataCell className="account-row">
                    <CButton
                      color="primary"
                      size="sm"
                      title="Editar Cuenta"
                      disabled={deshabilitar}
                      onClick={() =>
                        history.push({
                          pathname: '/cuentas/editar',
                          id_cuenta: item.id_cuenta,
                          numero_cuenta: item.numero_cuenta,
                          nombre: item.nombre,
                          id_empresa: item.id_empresa,
                          id_banco: item.id_banco,
                          id_moneda: item.id_moneda,
                          codigo_ach: item.codigo_ach,
                        })
                      }
                    >
                      <FaPen />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              )
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

export default Cuentas
