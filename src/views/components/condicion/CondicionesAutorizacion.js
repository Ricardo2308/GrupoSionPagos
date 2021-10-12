import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSession } from 'react-use-session'
import { Modal } from 'react-bootstrap'
import { FaPen, FaTrash, FaUsersCog, FaUsers } from 'react-icons/fa'
import { getCondicionesAutorizacion } from '../../../services/getCondicionesAutorizacion'
import { getPerfilUsuario } from '../../../services/getPerfilUsuario'
import { postCondicionAutorizacion } from '../../../services/postCondicionAutorizacion'
import '../../../scss/estilos.scss'
import {
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

const Cards = () => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])
  const [show, setShow] = useState(false)
  const [idCondicion, setIdCondicion] = useState(0)

  const handleClose = () => setShow(false)

  useEffect(() => {
    let mounted = true
    getCondicionesAutorizacion(null, null).then((items) => {
      if (mounted) {
        setList(items.condiciones)
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

  function mostrarModal(id_condicion) {
    setIdCondicion(id_condicion)
    setShow(true)
  }

  async function eliminarCondicion(id_condicion) {
    const respuesta = await postCondicionAutorizacion(id_condicion, '', '', '', '2')
    if (respuesta === 'OK') {
      await getCondicionesAutorizacion(null, null).then((items) => {
        setList(items.condiciones)
      })
    }
  }

  if (session) {
    let deshabilitar = false
    let deshabilitar_grupos = false
    if (ExistePermiso('Modulo Condiciones')) {
      deshabilitar_grupos = true
    }
    if (ExistePermiso('Modulo Grupos Autorizacion')) {
      deshabilitar = true
    }
    if (ExistePermiso('Modulo Condiciones') && ExistePermiso('Modulo Grupos Autorizacion')) {
      deshabilitar = false
      deshabilitar_grupos = false
    }
    if (!ExistePermiso('Modulo Condiciones') && !ExistePermiso('Modulo Grupos Autorizacion')) {
      deshabilitar = true
      deshabilitar_grupos = true
    }
    return (
      <>
        <Modal variant="primary" show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación</Modal.Title>
          </Modal.Header>
          <Modal.Body>Está seguro de eliminar esta condición de autorización?</Modal.Body>
          <Modal.Footer>
            <CButton color="secondary" onClick={handleClose}>
              Cancelar
            </CButton>
            <CButton
              color="primary"
              onClick={() => eliminarCondicion(idCondicion).then(handleClose)}
            >
              Aceptar
            </CButton>
          </Modal.Footer>
        </Modal>
        <div className="float-right" style={{ marginBottom: '10px' }}>
          <CButton
            color="primary"
            size="sm"
            disabled={deshabilitar}
            onClick={() => history.push('/condiciones/nueva')}
          >
            Crear Nueva
          </CButton>
        </div>
        <CTable hover responsive align="middle" className="mb-0 border">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell style={{ textAlign: 'center', width: '45%' }}>
                Descripción
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center">Parámetro</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Estado</CTableHeaderCell>
              <CTableHeaderCell style={{ textAlign: 'center', width: '20%' }}>
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
                  <CTableRow key={item.id_rol}>
                    <CTableDataCell className="text-center">{item.descripcion}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.parametro}</CTableDataCell>
                    <CTableDataCell className="text-center">{estado}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton
                        color="info"
                        size="sm"
                        title="Consultar Condición Grupos"
                        disabled={deshabilitar_grupos}
                        onClick={() =>
                          history.push({
                            pathname: '/condiciones/consulta',
                            id_condicion: item.id_condicionautorizacion,
                            descripcion: item.descripcion,
                            estado: estado,
                          })
                        }
                      >
                        <FaUsers />
                      </CButton>{' '}
                      <CButton
                        color="success"
                        size="sm"
                        title="Asignar Grupo Autorización"
                        disabled={deshabilitar_grupos}
                        onClick={() =>
                          history.push({
                            pathname: '/condiciones/condiciongrupo',
                            id_condicion: item.id_condicionautorizacion,
                            descripcion: item.descripcion,
                            estado: item.activo,
                          })
                        }
                      >
                        <FaUsersCog />
                      </CButton>{' '}
                      <CButton
                        color="primary"
                        size="sm"
                        title="Editar Condición Autorización"
                        disabled={deshabilitar}
                        onClick={() =>
                          history.push({
                            pathname: '/condiciones/editar',
                            id_condicion: item.id_condicionautorizacion,
                            descripcion: item.descripcion,
                            parametro: item.parametro,
                            estado: item.activo,
                          })
                        }
                      >
                        <FaPen />
                      </CButton>{' '}
                      <CButton
                        color="danger"
                        size="sm"
                        title="Eliminar Condición Autorización"
                        disabled={deshabilitar}
                        onClick={() => mostrarModal(item.id_condicionautorizacion)}
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

export default Cards
