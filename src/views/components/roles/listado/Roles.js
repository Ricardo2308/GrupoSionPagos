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
import { getRoles } from '../../../../services/getRoles'
import { postCrudRoles } from '../../../../services/postCrudRoles'
import { useSession } from 'react-use-session'
import { FaUserEdit, FaTrash, FaUserCog, FaClipboardList } from 'react-icons/fa'
import '../../../../scss/estilos.scss'

const Roles = () => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [show, setShow] = useState(false)
  const [idRol, setIdRol] = useState(0)

  const handleClose = () => setShow(false)

  useEffect(() => {
    let mounted = true
    getRoles(null, null).then((items) => {
      if (mounted) {
        setList(items.roles)
      }
    })
    return () => (mounted = false)
  }, [])

  function mostrarModal(id_rol) {
    setIdRol(id_rol)
    setShow(true)
  }

  async function eliminarUsuario(id) {
    const respuesta = await postCrudRoles(id, '', '', '', '2')
    if (respuesta === 'OK') {
      await getRoles(null, null).then((items) => {
        setList(items.roles)
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
          <Modal.Body>Está seguro de eliminar este rol?</Modal.Body>
          <Modal.Footer>
            <CButton color="secondary" onClick={handleClose}>
              Cancelar
            </CButton>
            <CButton color="primary" onClick={() => eliminarUsuario(idRol).then(handleClose)}>
              Aceptar
            </CButton>
          </Modal.Footer>
        </Modal>
        <div className="float-right" style={{ marginBottom: '10px' }}>
          <CButton
            color="primary"
            size="sm"
            //disabled={deshabilitar}
            onClick={() => history.push('/roles/nuevo')}
          >
            Crear Nuevo
          </CButton>
        </div>
        <CTable hover responsive align="middle" className="mb-0 border">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell className="text-center">Descripción</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Objeto</CTableHeaderCell>
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
                  <CTableRow key={item.id_rol}>
                    <CTableDataCell className="text-center">{item.descripcion}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.objeto}</CTableDataCell>
                    <CTableDataCell className="text-center">{estado}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton
                        color="info"
                        size="sm"
                        title="Consultar Rol Permiso"
                        onClick={() =>
                          history.push({
                            pathname: '/roles/consulta',
                            id_rol: item.id_rol,
                            descripcion: item.descripcion,
                            estado: estado,
                          })
                        }
                      >
                        <FaClipboardList />
                      </CButton>{' '}
                      <CButton
                        color="success"
                        size="sm"
                        title="Asignar Permiso"
                        onClick={() =>
                          history.push({
                            pathname: '/roles/rolpermiso',
                            id_rol: item.id_rol,
                            descripcion: item.descripcion,
                            estado: item.activo,
                          })
                        }
                      >
                        <FaUserCog />
                      </CButton>{' '}
                      <CButton
                        color="primary"
                        size="sm"
                        title="Editar Rol"
                        onClick={() =>
                          history.push({
                            pathname: '/roles/editar',
                            id_rol: item.id_rol,
                            descripcion: item.descripcion,
                            objeto: item.objeto,
                            estado: item.activo,
                          })
                        }
                      >
                        <FaUserEdit />
                      </CButton>{' '}
                      <CButton
                        color="danger"
                        size="sm"
                        title="Eliminar Rol"
                        onClick={() => mostrarModal(item.id_rol)}
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

export default Roles
