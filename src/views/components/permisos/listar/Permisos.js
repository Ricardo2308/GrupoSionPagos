import React, { useState, useEffect } from 'react'
import { getPermisos } from '../../../../services/getPermisos'
import { useHistory } from 'react-router-dom'
import { postCrudPermiso } from '../../../../services/postCrudPermiso'
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
import { useSession } from 'react-use-session'
import { FaUserEdit, FaTrash } from 'react-icons/fa'
import '../../../../scss/estilos.scss'

const Permisos = () => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [show, setShow] = useState(false)
  const [idPermiso, setIdPermiso] = useState(0)

  const handleClose = () => setShow(false)

  useEffect(() => {
    let mounted = true
    getPermisos(null, null).then((items) => {
      if (mounted) {
        setList(items.permisos)
        console.log(items)
      }
    })
    return () => (mounted = false)
  }, [])

  function mostrarModal(id) {
    setIdPermiso(id)
    setShow(true)
  }

  async function eliminarPermiso(id) {
    const respuesta = await postCrudPermiso(id, '', '', '2')
    if (respuesta === 'OK') {
      await getPermisos(null, null).then((items) => {
        setList(items.permisos)
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
          <Modal.Body>Está seguro de eliminar este permiso?</Modal.Body>
          <Modal.Footer>
            <CButton color="secondary" onClick={handleClose}>
              Cancelar
            </CButton>
            <CButton color="primary" onClick={() => eliminarPermiso(idPermiso).then(handleClose)}>
              Aceptar
            </CButton>
          </Modal.Footer>
        </Modal>
        <CTable hover responsive align="middle" className="mb-0 border">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell className="text-center">Descripcion</CTableHeaderCell>
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
                  <CTableRow key={item.id_permiso}>
                    <CTableDataCell className="text-center">{item.descripcion}</CTableDataCell>
                    <CTableDataCell className="text-center">{estado}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton
                        color="primary"
                        size="sm"
                        onClick={() =>
                          history.push({
                            pathname: '/permisos/editar',
                            id_permiso: item.id_permiso,
                            descripcion: item.descripcion,
                            estado: item.activo,
                          })
                        }
                      >
                        <FaUserEdit />
                      </CButton>{' '}
                      <CButton color="danger" size="sm" onClick={() => mostrarModal(item.id)}>
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

export default Permisos
