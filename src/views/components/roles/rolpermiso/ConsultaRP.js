import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
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
import { postRolPermiso } from 'src/services/postRolPermiso'
import { getRolPermiso } from '../../../../services/getRolPermiso'
import { useSession } from 'react-use-session'
import { FaTrash, FaPen } from 'react-icons/fa'
import { BsToggles } from 'react-icons/bs'
import '../../../../scss/estilos.scss'

const ConsultarRP = () => {
  const history = useHistory()
  const location = useLocation()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [show, setShow] = useState(false)
  const [idPermiso, setIdPermiso] = useState(0)
  const [estado, setEstado] = useState(0)
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')

  const handleClose = () => setShow(false)

  useEffect(() => {
    let mounted = true
    getRolPermiso(location.id_rol, null).then((items) => {
      if (mounted) {
        setList(items.detalle)
      }
    })
    return () => (mounted = false)
  }, [])

  function mostrarModal(id_permiso, opcion, estado) {
    if (opcion === '1') {
      setMensaje('Está seguro de eliminar este detalle de permisos del rol?')
      setIdPermiso(id_permiso)
      setOpcion(opcion)
      setShow(true)
    } else if (opcion === '3') {
      setMensaje('Está seguro de cambiar el estado de este permiso del rol?')
      setIdPermiso(id_permiso)
      setEstado(estado)
      setOpcion(opcion)
      setShow(true)
    }
  }

  async function crudRolPermiso(id_rol, id_rolpermiso, opcion, estado) {
    let result
    if (opcion === '1') {
      const respuesta = await postRolPermiso(id_rolpermiso, '', '', '1', '', '')
      if (respuesta === 'OK') {
        await getRolPermiso(id_rol, null).then((items) => {
          setList(items.detalle)
        })
      }
    } else if (opcion === '3') {
      if (estado === '0') {
        result = '1'
      } else {
        result = '0'
      }
      const respuesta = await postRolPermiso(id_rolpermiso, '', '', '3', '', result)
      if (respuesta === 'OK') {
        await getRolPermiso(id_rol, null).then((items) => {
          setList(items.detalle)
        })
      }
    }
  }

  if (session) {
    if (location.id_rol) {
      return (
        <>
          <Modal variant="primary" show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>Confirmación</Modal.Title>
            </Modal.Header>
            <Modal.Body>{mensaje}</Modal.Body>
            <Modal.Footer>
              <CButton color="secondary" onClick={handleClose}>
                Cancelar
              </CButton>
              <CButton
                color="primary"
                onClick={() =>
                  crudRolPermiso(location.id_rol, idPermiso, opcion, estado).then(handleClose)
                }
              >
                Aceptar
              </CButton>
            </Modal.Footer>
          </Modal>
          <div
            style={{
              width: '100%',
              textAlign: 'center',
              fontWeight: 'bold',
              borderColor: 'black',
            }}
          >
            <p>{location.descripcion}</p>
          </div>
          <CTable hover responsive align="middle" className="mb-0 border">
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell className="text-center">Nombre Permiso</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Estado Permiso</CTableHeaderCell>
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
                      <CTableDataCell className="text-center">{estado}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton
                          color="primary"
                          size="sm"
                          title="Cambiar Permiso"
                          onClick={() =>
                            history.push({
                              pathname: '/roles/editarRP',
                              id_rolpermiso: item.id_rolpermiso,
                              id_rol: item.id_rol,
                              id_permiso: item.id_permiso,
                              descripcion: item.descripcion,
                              nombre: location.descripcion,
                              estado: item.activo,
                            })
                          }
                        >
                          <FaPen />
                        </CButton>{' '}
                        <CButton
                          color="danger"
                          size="sm"
                          title="Eliminar Permiso"
                          onClick={() => mostrarModal(item.id_rolpermiso, '1', '')}
                        >
                          <FaTrash />
                        </CButton>{' '}
                        <CButton
                          color="info"
                          size="sm"
                          title="Cambiar Estado"
                          onClick={() => mostrarModal(item.id_rolpermiso, '3', item.activo)}
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
      history.push('/roles/roles')
      return (
        <div className="sin-sesion">
          NO SE CARGÓ EL CÓDIGO DEL ROL. REGRESE A LA PANTALLA DE ROLES.
        </div>
      )
    }
  } else {
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default ConsultarRP
