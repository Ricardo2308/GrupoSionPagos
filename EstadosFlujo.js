import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import {
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { getEstadosFlujo } from '../../../../services/getEstadosFlujo'
import { postEstadoFlujo } from '../../../../services/postEstadoFlujo'
import { useSession } from 'react-use-session'
import { FaPen, FaTrash } from 'react-icons/fa'
import '../../../../scss/estilos.scss'

const EstadosFlujo = () => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [show, setShow] = useState(false)
  const [idEstado, setIdEstado] = useState(0)

  const handleClose = () => setShow(false)

  useEffect(() => {
    let mounted = true
    getEstadosFlujo(null, null).then((items) => {
      if (mounted) {
        setList(items.estados)
        console.log(items)
      }
    })
    return () => (mounted = false)
  }, [])

  function mostrarModal(id_estado) {
    setIdEstado(id_estado)
    setShow(true)
  }

  async function eliminarEstado(id_estado) {
    const respuesta = await postEstadoFlujo(id_estado, '', '', '', '2')
    if (respuesta === 'OK') {
      await getEstadosFlujo(null, null).then((items) => {
        setList(items.estados)
      })
    }
  }

  if (session) {
    return (
      <>
        <Modal variant="primary" show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación</Modal.Title>
          </Modal.Header>
          <Modal.Body>Está seguro de eliminar este estado de flujo?</Modal.Body>
          <Modal.Footer>
            <CButton color="secondary" onClick={handleClose}>
              Cancelar
            </CButton>
            <CButton color="primary" onClick={() => eliminarEstado(idEstado).then(handleClose)}>
              Aceptar
            </CButton>
          </Modal.Footer>
        </Modal>
        <CTable hover responsive align="middle" className="mb-0 border">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell className="text-center">Estado Flujo</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Estado Flujo Padre</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Estado</CTableHeaderCell>
              <CTableHeaderCell style={{ textAlign: 'center', width: '20%' }}>
                Acciones
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {results.map((item, i) => {
              let estado = 'Inactivo'
              let asignacion = ''
              if (item.eliminado !== '1') {
                if (item.activo === '1') {
                  estado = 'Activo'
                }
                if (item.id_estadoflujopadre === '' || item.id_estadoflujopadre === '0') {
                  asignacion = 'No asignado'
                } else {
                  asignacion = item.estadopadre
                }
                return (
                  <CTableRow key={item.id_estadoflujo}>
                    <CTableDataCell className="text-center">{item.descripcion}</CTableDataCell>
                    <CTableDataCell className="text-center">{asignacion}</CTableDataCell>
                    <CTableDataCell className="text-center">{estado}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton
                        color="primary"
                        size="sm"
                        title="Editar Estado Flujo"
                        onClick={() =>
                          history.push({
                            pathname: '/estadoflujo/editar',
                            id_estado: item.id_estadoflujo,
                            id_estadopadre: item.id_estadoflujopadre,
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
                        title="Eliminar Estado Flujo"
                        onClick={() => mostrarModal(item.id_estadoflujo)}
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

export default EstadosFlujo