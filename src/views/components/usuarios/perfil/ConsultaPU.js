import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { postPerfilUsuario } from '../../../../services/postPerfilUsuario'
import { useSession } from 'react-use-session'
import { FaTrash, FaPen, FaUsersCog } from 'react-icons/fa'
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

const Consultar = () => {
  const history = useHistory()
  const location = useLocation()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])
  const [show, setShow] = useState(false)
  const [idPerfil, setIdPerfil] = useState(0)
  const [estado, setEstado] = useState(0)
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')

  const handleClose = () => setShow(false)

  useEffect(() => {
    let mounted = true
    getPerfilUsuario(location.id_usuario, '1').then((items) => {
      if (mounted) {
        setList(items.detalle)
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
    let result = false
    for (let item of permisos) {
      if (objeto === item.objeto) {
        result = true
      }
    }
    return result
  }

  function mostrarModal(id_perfil, opcion, estado) {
    if (opcion === '1') {
      setMensaje('Está seguro de eliminar este perfil de usuario?')
      setIdPerfil(id_perfil)
      setOpcion(opcion)
      setShow(true)
    } else if (opcion === '3') {
      setMensaje('Está seguro de cambiar el estado de este perfil de usuario?')
      setIdPerfil(id_perfil)
      setEstado(estado)
      setOpcion(opcion)
      setShow(true)
    }
  }

  async function crudPerfil(id_usuario, id_usuarioperfil, opcion, estado) {
    let result
    if (opcion === '1') {
      const respuesta = await postPerfilUsuario(id_usuarioperfil, '', '', '1', '', '')
      if (respuesta === 'OK') {
        await getPerfilUsuario(id_usuario, '1').then((items) => {
          setList(items.detalle)
        })
      }
    } else if (opcion === '3') {
      if (estado === '0') {
        result = '1'
      } else {
        result = '0'
      }
      const respuesta = await postPerfilUsuario(id_usuarioperfil, '', '', '3', '', result)
      if (respuesta === 'OK') {
        await getPerfilUsuario(id_usuario, '1').then((items) => {
          setList(items.detalle)
        })
      }
    }
  }

  if (session) {
    if (location.id_usuario) {
      let deshabilitar = false
      let deshabilitar_grupo = false
      if (ExistePermiso('Modulo Usuarios')) {
        deshabilitar_grupo = true
      }
      if (ExistePermiso('Modulo Grupos Autorizacion')) {
        deshabilitar = true
      }
      if (ExistePermiso('Modulo Usuarios') && ExistePermiso('Modulo Grupos Autorizacion')) {
        deshabilitar = false
        deshabilitar_grupo = false
      }
      if (!ExistePermiso('Modulo Usuarios') && !ExistePermiso('Modulo Grupos Autorizacion')) {
        deshabilitar_grupo = true
        deshabilitar = true
      }
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
                  crudPerfil(location.id_usuario, idPerfil, opcion, estado).then(handleClose)
                }
              >
                Aceptar
              </CButton>
            </Modal.Footer>
          </Modal>
          <div className="user-name-profile">
            {location.nombre}{' '}
            <CButton
              color="warning"
              size="sm"
              title="Asignar Grupo Autorización"
              disabled={deshabilitar_grupo}
              onClick={() =>
                history.push({
                  pathname: '/usuarios/usuariogrupo',
                  id_usuario: session.id,
                  nombre: session.name,
                  email: session.email,
                  estado: session.estado,
                })
              }
            >
              <FaUsersCog />
            </CButton>
          </div>
          <CTable hover responsive align="middle" className="mb-0 border">
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell style={{ textAlign: 'center', width: '40%' }}>
                  Nombre Perfil
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center">Estado Usuario Perfil</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Acciones</CTableHeaderCell>
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
                    <CTableRow key={item.id_usuario}>
                      <CTableDataCell style={{ textAlign: 'center', width: '40%' }}>
                        {item.descripcion}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">{estado}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton
                          color="primary"
                          size="sm"
                          title="Cambiar Perfil"
                          disabled={deshabilitar}
                          onClick={() =>
                            history.push({
                              pathname: '/usuarios/editarPU',
                              id_usuarioperfil: item.id_usuarioperfil,
                              id_usuario: item.id_usuario,
                              id_perfil: item.id_perfil,
                              nombre: location.nombre,
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
                          title="Eliminar Perfil Asociado"
                          disabled={deshabilitar}
                          onClick={() => mostrarModal(item.id_usuarioperfil, '1', '')}
                        >
                          <FaTrash />
                        </CButton>{' '}
                        <CButton
                          color="info"
                          size="sm"
                          title="Cambiar Estado"
                          disabled={deshabilitar}
                          onClick={() => mostrarModal(item.id_usuarioperfil, '3', item.activo)}
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
      history.push('/usuarios')
      return (
        <div className="sin-sesion">
          NO SE CARGÓ EL CÓDIGO DEL USUARIO. REGRESE A LA PANTALLA DE USUARIOS.
        </div>
      )
    }
  } else {
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default Consultar
