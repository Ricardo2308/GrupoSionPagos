import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { getUsuarioAutorizacion } from '../../../../services/getUsuarioAutorizacion'
import { postUsuarioAutorizacion } from '../../../../services/postUsuarioAutorizacion'
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
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [show, setShow] = useState(false)
  const [idAutorizacion, setidAutorizacion] = useState(0)
  const [estado, setEstado] = useState(0)
  const [opcion, setOpcion] = useState(0)

  const handleClose = () => setShow(false)

  useEffect(() => {
    let mounted = true
    getUsuarioAutorizacion(session.id, null).then((items) => {
      if (mounted) {
        setList(items.autorizacion)
      }
    })
    return () => (mounted = false)
  }, [])

  function mostrarModal(id_autorizacion, opcion, estado) {
    setidAutorizacion(id_autorizacion)
    setEstado(estado)
    setOpcion(opcion)
    setShow(true)
  }

  async function cambiarEstado(id_autorizacion, opcion, estado) {
    let result
    if (estado === '0') {
      result = '1'
    } else {
      result = '0'
    }
    const respuesta = await postUsuarioAutorizacion(id_autorizacion, '', '', '', '', opcion, result)
    if (respuesta === 'OK') {
      await getUsuarioAutorizacion(session.id, null).then((items) => {
        setList(items.autorizacion)
      })
    }
  }

  if (session) {
    return (
      <>
        <Modal responsive variant="primary" show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Está seguro de cambiar el estado de la autorización de encargado temporal?
          </Modal.Body>
          <Modal.Footer>
            <CButton color="secondary" onClick={handleClose}>
              Cancelar
            </CButton>
            <CButton
              color="primary"
              onClick={() => cambiarEstado(idAutorizacion, opcion, estado).then(handleClose)}
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
            onClick={() => history.push('/autorizacion/nueva')}
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
              if (item.eliminado !== '1') {
                if (item.activo === '1') {
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
                        onClick={() => mostrarModal(item.id_usuarioautorizacion, '1', item.activo)}
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
