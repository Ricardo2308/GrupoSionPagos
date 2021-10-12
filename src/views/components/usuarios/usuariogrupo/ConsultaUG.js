import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { getUsuarioGrupo } from '../../../../services/getUsuarioGrupo'
import { postUsuarioGrupo } from '../../../../services/postUsuarioGrupo'
import { useSession } from 'react-use-session'
import { FaTrash, FaPen } from 'react-icons/fa'
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
  const [idGrupo, setIdGrupo] = useState(0)
  const [estado, setEstado] = useState(0)
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')

  const handleClose = () => setShow(false)

  useEffect(() => {
    let mounted = true
    getUsuarioGrupo(location.id_usuario, null).then((items) => {
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

  function ExistePermiso(id_permiso, objeto) {
    let result = 0
    for (let item of permisos) {
      if (objeto === item.objeto) {
        result = 1
      }
    }
    return result
  }

  function mostrarModal(id_perfil, id_grupo, opcion, estado) {
    if (opcion === '1') {
      setMensaje('Está seguro de eliminar este grupo?')
      setIdGrupo(id_grupo)
      setOpcion(opcion)
      setShow(true)
    } else if (opcion === '3') {
      setMensaje('Está seguro de cambiar el estado de este grupo?')
      setIdGrupo(id_grupo)
      setEstado(estado)
      setOpcion(opcion)
      setShow(true)
    }
  }

  async function crudPerfil(id_usuariogrupo, id_usuario, opcion, estado) {
    let result
    if (opcion === '1') {
      const respuesta = await postUsuarioGrupo(id_usuariogrupo, id_usuario, '1', '', '', '')
      if (respuesta === 'OK') {
        await getUsuarioGrupo(id_usuario, null).then((items) => {
          setList(items.detalle)
        })
      }
    } else if (opcion === '3') {
      if (estado === '0') {
        result = '1'
      } else {
        result = '0'
      }
      const respuesta = await postUsuarioGrupo(id_usuariogrupo, id_usuario, '3', '', '', result)
      if (respuesta === 'OK') {
        await getUsuarioGrupo(id_usuario, null).then((items) => {
          setList(items.detalle)
        })
      }
    }
  }

  if (session) {
    if (location.id_usuario) {
      let deshabilitar = false
      if (ExistePermiso('6', 'Modulo Grupos Autorizacion') == 0) {
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
                  crudPerfil(idGrupo, location.id_usuario, opcion, estado).then(handleClose)
                }
              >
                Aceptar
              </CButton>
            </Modal.Footer>
          </Modal>
          <div className="float-right">
            <CButton
              color="primary"
              size="sm"
              disabled={deshabilitar}
              onClick={() =>
                history.push({
                  pathname: '/usuarios/agregargrupo',
                  id_usuario: location.id_usuario,
                  nombre: location.nombre,
                  email: location.email,
                  estado: session.estado,
                })
              }
            >
              Agregar Grupo
            </CButton>
          </div>
          <div>
            <div className="user-name">{location.nombre}</div>
            <CTable
              hover
              responsive
              align="middle"
              className="mb-0 border"
              style={{ marginTop: '15px' }}
            >
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell style={{ textAlign: 'center', width: '40%' }}>
                    Grupo Autorización
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Nivel</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Estado Usuario Grupo</CTableHeaderCell>
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
                          {item.identificador}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">{item.nivel}</CTableDataCell>
                        <CTableDataCell className="text-center">{estado}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CButton
                            color="primary"
                            size="sm"
                            title="Elegir Nuevo Grupo"
                            disabled={deshabilitar}
                            onClick={() =>
                              history.push({
                                pathname: '/usuarios/editarusuariogrupo',
                                id_usuariogrupo: item.id_usuariogrupo,
                                id_usuario: location.id_usuario,
                                email: location.email,
                                nombre: location.nombre,
                                nivel: item.nivel,
                                estado: item.activo,
                                id_grupo: item.id_grupoautorizacion,
                                identificador: item.identificador,
                              })
                            }
                          >
                            <FaPen />
                          </CButton>{' '}
                          <CButton
                            color="danger"
                            size="sm"
                            title="Eliminar Grupo Asociado"
                            disabled={deshabilitar}
                            onClick={() => mostrarModal('', item.id_usuariogrupo, '1', '')}
                          >
                            <FaTrash />
                          </CButton>{' '}
                          <CButton
                            color="info"
                            size="sm"
                            title="Cambiar de Estado"
                            disabled={deshabilitar}
                            onClick={() => mostrarModal('', item.id_usuariogrupo, '3', item.activo)}
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
          </div>
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
