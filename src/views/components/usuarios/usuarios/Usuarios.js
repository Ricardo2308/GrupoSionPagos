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
import { getUsuarios } from '../../../../services/getUsuarios'
import { postEditarUsuario } from '../../../../services/postEditarUsuario'
import { useSession } from 'react-use-session'
import { FaUserEdit, FaTrash, FaUserCog, FaUserCircle, FaUsersCog } from 'react-icons/fa'
import '../../../../scss/estilos.scss'

const Usuarios = () => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [show, setShow] = useState(false)
  const [nombreUsuario, setNombreUsuario] = useState('')
  const [idUsuario, setIdUsuario] = useState(0)

  const handleClose = () => setShow(false)

  useEffect(() => {
    let mounted = true
    getUsuarios(null, null, null, null).then((items) => {
      if (mounted) {
        setList(items.users)
        console.log(items)
      }
    })
    return () => (mounted = false)
  }, [])

  function mostrarModal(id, nombre) {
    setIdUsuario(id)
    setNombreUsuario(nombre)
    setShow(true)
  }

  async function eliminarUsuario(id) {
    const respuesta = await postEditarUsuario(id, '', '', '', '', '', '3')
    if (respuesta === 'OK') {
      await getUsuarios(null, null, null, null).then((items) => {
        setList(items.users)
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
          <Modal.Body>Está seguro de eliminar al usuario {nombreUsuario}?</Modal.Body>
          <Modal.Footer>
            <CButton color="secondary" onClick={handleClose}>
              Cancelar
            </CButton>
            <CButton color="primary" onClick={() => eliminarUsuario(idUsuario).then(handleClose)}>
              Aceptar
            </CButton>
          </Modal.Footer>
        </Modal>
        <CTable hover responsive align="middle" className="mb-0 border">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell className="text-center">Nombre</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Correo</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Usuario</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Estado</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {results.map((item, i) => {
              let estado = 'Inactivo'
              if (item.estado_eliminado !== '1' && item.id !== session.id) {
                if (item.estado_activo === '1') {
                  estado = 'Activo'
                }
                return (
                  <CTableRow key={item.id}>
                    <CTableDataCell className="text-center">
                      {item.nombre} {item.apellido}
                    </CTableDataCell>
                    <CTableDataCell className="text-center">{item.email}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.nombre_usuario}</CTableDataCell>
                    <CTableDataCell className="text-center">{estado}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton
                        color="info"
                        size="sm"
                        onClick={() =>
                          history.push({
                            pathname: '/base/consulta',
                            id_usuario: item.id,
                            email: item.email,
                            nombre: item.nombre + ' ' + item.apellido,
                            estado: item.estado_activo,
                            inhabilitar: false,
                          })
                        }
                      >
                        <FaUserCircle />
                      </CButton>{' '}
                      <CButton
                        color="success"
                        size="sm"
                        onClick={() =>
                          history.push({
                            pathname: '/base/perfilusuario',
                            id: item.id,
                            nombre: item.nombre + ' ' + item.apellido,
                            email: item.email,
                            estado: item.estado_activo,
                          })
                        }
                      >
                        <FaUserCog />
                      </CButton>{' '}
                      <CButton
                        color="warning"
                        size="sm"
                        onClick={() =>
                          history.push({
                            pathname: '/base/usuariogrupo',
                            id: item.id,
                            nombre: item.nombre + ' ' + item.apellido,
                            email: item.email,
                            estado: item.estado_activo,
                            inhabilitar: true,
                          })
                        }
                      >
                        <FaUsersCog />
                      </CButton>{' '}
                      <CButton
                        color="primary"
                        size="sm"
                        onClick={() =>
                          history.push({
                            pathname: '/base/editar',
                            id: item.id,
                            nombre: item.nombre,
                            apellido: item.apellido,
                            usuario: item.nombre_usuario,
                            email: item.email,
                            password: item.password,
                            estado: item.estado_activo,
                          })
                        }
                      >
                        <FaUserEdit />
                      </CButton>{' '}
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => mostrarModal(item.id, item.nombre + ' ' + item.apellido)}
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

export default Usuarios
