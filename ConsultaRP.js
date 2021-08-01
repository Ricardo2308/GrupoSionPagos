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
        setList(items.perfil)
        console.log(items)
      }
    })
    return () => (mounted = false)
  }, [])

  function mostrarModal(id_permiso, opcion, estado) {
    if (opcion === '2') {
      setMensaje('Está seguro de eliminar este detalle de permisos del rol?')
      setIdPermiso(id_permiso)
      setOpcion(opcion)
      setShow(true)
    } else if (opcion === '4') {
      setMensaje('Está seguro de cambiar el estado de este permiso del rol?')
      setIdPermiso(id_permiso)
      setEstado(estado)
      setOpcion(opcion)
      setShow(true)
    }
  }

  async function crudRolPermiso(id_rol, id_permiso, opcion, estado) {
    let result
    if (opcion === '2') {
      const respuesta = await postRolPermiso('', id_rol, '', '2', id_permiso, '')
      if (respuesta === 'OK') {
        await getRolPermiso(id_rol, null).then((items) => {
          setList(items.perfil)
        })
      }
    } else if (opcion === '4') {
      if (estado === '0') {
        result = '1'
      } else {
        result = '0'
      }
      const respuesta = await postRolPermiso('', id_rol, '', '4', id_permiso, result)
      if (respuesta === 'OK') {
        await getRolPermiso(id_rol, null).then((items) => {
          setList(items.perfil)
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
                if (item.estado_eliminado !== '1') {
                  if (item.estado_activo === '1') {
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
                              estado: item.estado_activo,
                            })
                          }
                        >
                          <FaPen />
                        </CButton>{' '}
                        <CButton
                          color="danger"
                          size="sm"
                          title="Eliminar Permiso"
                          onClick={() => mostrarModal(item.id_permiso, '2', '')}
                        >
                          <FaTrash />
                        </CButton>{' '}
                        <CButton
                          color="info"
                          size="sm"
                          title="Cambiar Estado"
                          onClick={() => mostrarModal(item.id_permiso, '4', item.estado_activo)}
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
