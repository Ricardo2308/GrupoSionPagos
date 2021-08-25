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
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { postPerfilUsuario } from '../../../../services/postPerfilUsuario'
import { getUsuarioGrupo } from '../../../../services/getUsuarioGrupo'
import { postUsuarioGrupo } from '../../../../services/postUsuarioGrupo'
import { useSession } from 'react-use-session'
import { FaTrash, FaPen } from 'react-icons/fa'
import { BsToggles } from 'react-icons/bs'
import '../../../../scss/estilos.scss'

const Consultar = () => {
  const history = useHistory()
  const location = useLocation()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [results1, setList1] = useState([])
  const [show, setShow] = useState(false)
  const [idPerfil, setIdPerfil] = useState(0)
  const [idGrupo, setIdGrupo] = useState(0)
  const [estado, setEstado] = useState(0)
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')

  const handleClose = () => setShow(false)

  useEffect(() => {
    let mounted = true
    getPerfilUsuario(location.id_usuario, null).then((items) => {
      if (mounted) {
        setList(items.detalle)
      }
    })
    getUsuarioGrupo(location.id_usuario, null).then((items) => {
      if (mounted) {
        setList1(items.detalle)
      }
    })
    return () => (mounted = false)
  }, [])

  function mostrarModal(id_perfil, id_grupo, opcion, estado) {
    if (opcion === '1') {
      setMensaje('Está seguro de eliminar este perfil de usuario?')
      setIdPerfil(id_perfil)
      setIdGrupo(id_grupo)
      setOpcion(opcion)
      setShow(true)
    } else if (opcion === '3') {
      setMensaje('Está seguro de cambiar el estado de este perfil de usuario?')
      setIdPerfil(id_perfil)
      setIdGrupo(id_grupo)
      setEstado(estado)
      setOpcion(opcion)
      setShow(true)
    }
  }

  async function crudPerfil(id_usuario, id_usuarioperfil, id_usuariogrupo, opcion, estado) {
    let result
    if (opcion === '1') {
      if (id_usuarioperfil !== '' && id_usuariogrupo === '') {
        const respuesta = await postPerfilUsuario(id_usuarioperfil, '', '', '1', '', '')
        if (respuesta === 'OK') {
          await getPerfilUsuario(id_usuario, null).then((items) => {
            setList(items.detalle)
          })
        }
      } else if (id_usuarioperfil === '' && id_usuariogrupo !== '') {
        const respuesta = await postUsuarioGrupo(id_usuariogrupo, id_usuario, '1', '', '')
        if (respuesta === 'OK') {
          await getUsuarioGrupo(id_usuario, null).then((items) => {
            setList1(items.detalle)
          })
        }
      }
    } else if (opcion === '3') {
      if (estado === '0') {
        result = '1'
      } else {
        result = '0'
      }
      if (id_usuarioperfil !== '' && id_usuariogrupo === '') {
        const respuesta = await postPerfilUsuario(id_usuarioperfil, '', '', '3', '', result)
        if (respuesta === 'OK') {
          await getPerfilUsuario(id_usuario, null).then((items) => {
            setList(items.detalle)
          })
        }
      } else if (id_usuarioperfil === '' && id_usuariogrupo !== '') {
        const respuesta = await postUsuarioGrupo(id_usuariogrupo, id_usuario, '3', '', result)
        if (respuesta === 'OK') {
          await getUsuarioGrupo(id_usuario, null).then((items) => {
            setList1(items.detalle)
          })
        }
      }
    }
  }

  if (session) {
    if (location.id_usuario) {
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
                  crudPerfil(location.id_usuario, idPerfil, idGrupo, opcion, estado).then(
                    handleClose,
                  )
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
            <p>{location.nombre}</p>
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
                if (item.eliminado !== '1') {
                  if (item.activo === '1') {
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
                          disabled={location.inhabilitar}
                          onClick={() =>
                            history.push({
                              pathname: '/base/editarPU',
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
                          disabled={location.inhabilitar}
                          onClick={() => mostrarModal(item.id_usuarioperfil, '', '1', '')}
                        >
                          <FaTrash />
                        </CButton>{' '}
                        <CButton
                          color="info"
                          size="sm"
                          title="Cambiar Estado"
                          disabled={location.inhabilitar}
                          onClick={() => mostrarModal(item.id_usuarioperfil, '', '3', item.activo)}
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
                <CTableHeaderCell className="text-center">Estado Usuario Grupo</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {results1.map((item, i) => {
                let estado = 'Inactivo'
                if (item.eliminado !== '1') {
                  if (item.activo === '1') {
                    estado = 'Activo'
                  }
                  return (
                    <CTableRow key={item.id_usuario}>
                      <CTableDataCell style={{ textAlign: 'center', width: '40%' }}>
                        {item.identificador}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">{estado}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton
                          color="primary"
                          size="sm"
                          title="Elegir Nuevo Grupo"
                          disabled={location.inhabilitar}
                          onClick={() =>
                            history.push({
                              pathname: '/base/editarusuariogrupo',
                              id_usuariogrupo: item.id_usuariogrupo,
                              id: location.id_usuario,
                              email: location.email,
                              nombre: location.nombre,
                              nivel: item.nivel,
                              estado: item.activo,
                              id_grupo: item.id_grupoautorizacion,
                            })
                          }
                        >
                          <FaPen />
                        </CButton>{' '}
                        <CButton
                          color="danger"
                          size="sm"
                          title="Eliminar Grupo Asociado"
                          disabled={location.inhabilitar}
                          onClick={() => mostrarModal('', item.id_usuariogrupo, '1', '')}
                        >
                          <FaTrash />
                        </CButton>{' '}
                        <CButton
                          color="info"
                          size="sm"
                          title="Cambiar de Estado"
                          disabled={location.inhabilitar}
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
        </>
      )
    } else {
      history.push('/base/usuarios')
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
