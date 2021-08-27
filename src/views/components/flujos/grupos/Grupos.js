import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import { getGruposAutorizacion } from '../../../../services/getGruposAutorizacion'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { postGruposAutorizacion } from '../../../../services/postGruposAutorizacion'
import { useSession } from 'react-use-session'
import { FaPen, FaTrash } from 'react-icons/fa'
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

const GruposAutorizacion = () => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])
  const [show, setShow] = useState(false)
  const [idGrupo, setIdGrupo] = useState(0)

  const handleClose = () => setShow(false)

  useEffect(() => {
    let mounted = true
    getGruposAutorizacion(null, null).then((items) => {
      if (mounted) {
        setList(items.grupos)
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

  function mostrarModal(id_grupo) {
    setIdGrupo(id_grupo)
    setShow(true)
  }

  async function eliminarGrupo(id_grupo) {
    const respuesta = await postGruposAutorizacion(id_grupo, '', '', '', '', '2')
    if (respuesta === 'OK') {
      await getGruposAutorizacion(null, null).then((items) => {
        setList(items.grupos)
      })
    }
  }

  if (session) {
    let deshabilitar = false
    if (ExistePermiso('Modulo Grupos Autorizacion') == 0) {
      deshabilitar = true
    }
    return (
      <>
        <Modal variant="primary" show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación</Modal.Title>
          </Modal.Header>
          <Modal.Body>Está seguro de eliminar este grupo de autorización?</Modal.Body>
          <Modal.Footer>
            <CButton color="secondary" onClick={handleClose}>
              Cancelar
            </CButton>
            <CButton color="primary" onClick={() => eliminarGrupo(idGrupo).then(handleClose)}>
              Aceptar
            </CButton>
          </Modal.Footer>
        </Modal>
        <div className="float-right" style={{ marginBottom: '10px' }}>
          <CButton
            color="primary"
            size="sm"
            disabled={deshabilitar}
            onClick={() => history.push('/grupos/nuevo')}
          >
            Crear Nuevo
          </CButton>
        </div>
        <CTable hover responsive align="middle" className="mb-0 border">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell className="text-center">Grupo Autorización</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Niveles</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Descripcion</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Estado</CTableHeaderCell>
              <CTableHeaderCell style={{ textAlign: 'center', width: '15%' }}>
                Acciones
              </CTableHeaderCell>
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
                  <CTableRow key={item.id_grupo}>
                    <CTableDataCell className="text-center">{item.identificador}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.numero_niveles}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.descripcion}</CTableDataCell>
                    <CTableDataCell className="text-center">{estado}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton
                        color="primary"
                        size="sm"
                        title="Editar Grupo Autorización"
                        disabled={deshabilitar}
                        onClick={() =>
                          history.push({
                            pathname: '/grupos/editar',
                            id_grupo: item.id_grupo,
                            numero_niveles: item.numero_niveles,
                            identificador: item.identificador,
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
                        title="Eliminar Grupo Autorización"
                        disabled={deshabilitar}
                        onClick={() => mostrarModal(item.id_grupo)}
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

export default GruposAutorizacion
