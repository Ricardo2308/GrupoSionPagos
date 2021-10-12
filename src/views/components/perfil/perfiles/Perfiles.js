import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { postCrudPerfil } from '../../../../services/postCrudPerfil'
import { getPerfiles } from '../../../../services/getPerfiles'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { Modal } from 'react-bootstrap'
import { useSession } from 'react-use-session'
import { FaUserEdit, FaTrash, FaUserCog, FaClipboardList } from 'react-icons/fa'
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

const Perfiles = () => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])
  const [show, setShow] = useState(false)
  const [idPerfil, setIdPerfil] = useState(0)

  const handleClose = () => setShow(false)

  useEffect(() => {
    let mounted = true
    getPerfiles(null, null).then((items) => {
      if (mounted) {
        setList(items.perfiles)
      }
    })
    getPerfilUsuario(session.id, '2').then((items) => {
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

  function mostrarModal(id) {
    setIdPerfil(id)
    setShow(true)
  }

  async function eliminarPerfil(id) {
    const respuesta = await postCrudPerfil(id, '', '', '2')
    if (respuesta === 'OK') {
      await getPerfiles(null, null).then((items) => {
        setList(items.perfiles)
      })
    }
  }

  if (session) {
    let deshabilitar = false
    if (ExistePermiso('Modulo Perfiles') == 0) {
      deshabilitar = true
    }
    return (
      <>
        <Modal variant="primary" show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación</Modal.Title>
          </Modal.Header>
          <Modal.Body>Está seguro de eliminar este perfil?</Modal.Body>
          <Modal.Footer>
            <CButton color="secondary" onClick={handleClose}>
              Cancelar
            </CButton>
            <CButton color="primary" onClick={() => eliminarPerfil(idPerfil).then(handleClose)}>
              Aceptar
            </CButton>
          </Modal.Footer>
        </Modal>
        <div className="float-right" style={{ marginBottom: '10px' }}>
          <CButton
            color="primary"
            size="sm"
            disabled={deshabilitar}
            onClick={() => history.push('/perfiles/nuevo')}
          >
            Crear Nuevo
          </CButton>
        </div>
        <CTable hover responsive align="middle" className="mb-0 border">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell className="text-center">Descripcion</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Estado</CTableHeaderCell>
              <CTableHeaderCell style={{ textAlign: 'center', width: '38%' }}>
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
                  <CTableRow key={item.id_perfil}>
                    <CTableDataCell className="text-center">{item.descripcion}</CTableDataCell>
                    <CTableDataCell className="text-center">{estado}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton
                        color="info"
                        size="sm"
                        title="Consultar Perfil Rol"
                        disabled={deshabilitar}
                        onClick={() =>
                          history.push({
                            pathname: '/perfiles/consulta',
                            id_perfil: item.id_perfil,
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
                        title="Asignar Rol"
                        disabled={deshabilitar}
                        onClick={() =>
                          history.push({
                            pathname: '/perfiles/perfilrol',
                            id_perfil: item.id_perfil,
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
                        title="Editar Perfil"
                        disabled={deshabilitar}
                        onClick={() =>
                          history.push({
                            pathname: '/perfiles/editar',
                            id_perfil: item.id_perfil,
                            descripcion: item.descripcion,
                            estado: item.activo,
                          })
                        }
                      >
                        <FaUserEdit />
                      </CButton>{' '}
                      <CButton
                        color="danger"
                        size="sm"
                        title="Eliminar Perfil"
                        disabled={deshabilitar}
                        onClick={() => mostrarModal(item.id_perfil)}
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

export default Perfiles
