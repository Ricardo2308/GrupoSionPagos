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
import { getTiposFlujo } from '../../../../services/getTiposFlujo'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { postTipoFlujo } from '../../../../services/postTipoFlujo'
import { useSession } from 'react-use-session'
import { FaPen, FaTrash } from 'react-icons/fa'
import '../../../../scss/estilos.scss'

const TiposFlujo = () => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])
  const [show, setShow] = useState(false)
  const [idTipo, setIdTipo] = useState(0)

  const handleClose = () => setShow(false)

  useEffect(() => {
    let mounted = true
    getTiposFlujo(null, null).then((items) => {
      if (mounted) {
        setList(items.tipos)
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

  function mostrarModal(id_tipoflujo) {
    setIdTipo(id_tipoflujo)
    setShow(true)
  }

  async function eliminarTipo(id_tipoflujo) {
    const respuesta = await postTipoFlujo(id_tipoflujo, '', '', '', '2')
    if (respuesta === 'OK') {
      await getTiposFlujo(null, null).then((items) => {
        setList(items.tipos)
      })
    }
  }

  if (session) {
    let deshabilitar = false
    if (ExistePermiso('Modulo Tipos Flujo') == 0) {
      deshabilitar = true
    }
    return (
      <>
        <Modal variant="primary" show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación</Modal.Title>
          </Modal.Header>
          <Modal.Body>Está seguro de eliminar este estado de flujo?</Modal.Body>
          <Modal.Footer>
            <CButton color="secondary" onClick={handleClose}>
              Cancelar
            </CButton>
            <CButton color="primary" onClick={() => eliminarTipo(idTipo).then(handleClose)}>
              Aceptar
            </CButton>
          </Modal.Footer>
        </Modal>
        <div className="float-right" style={{ marginBottom: '10px' }}>
          <CButton
            color="primary"
            size="sm"
            disabled={deshabilitar}
            onClick={() => history.push('/tipoflujo/nuevo')}
          >
            Crear Nuevo
          </CButton>
        </div>
        <CTable hover responsive align="middle" className="mb-0 border">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell className="text-center">Tipo Flujo</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Estado Inicial</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Estado</CTableHeaderCell>
              <CTableHeaderCell style={{ textAlign: 'center', width: '20%' }}>
                Acciones
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {results.map((item, i) => {
              let asignacion = ''
              let estado = 'Inactivo'
              if (item.eliminado == 0) {
                if (item.activo == 1) {
                  estado = 'Activo'
                }
                if (item.id_estadoinicial === '' || item.id_estadoinicial === '0') {
                  asignacion = 'No asignado'
                } else {
                  asignacion = item.estadoinicial
                }
                return (
                  <CTableRow key={item.id_tipoflujo}>
                    <CTableDataCell className="text-center">{item.descripcion}</CTableDataCell>
                    <CTableDataCell className="text-center">{asignacion}</CTableDataCell>
                    <CTableDataCell className="text-center">{estado}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton
                        color="primary"
                        size="sm"
                        title="Editar Tipo Flujo"
                        disabled={deshabilitar}
                        onClick={() =>
                          history.push({
                            pathname: '/tipoflujo/editar',
                            id_tipoflujo: item.id_tipoflujo,
                            id_estadoinicial: item.id_estadoinicial,
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
                        title="Eliminar Tipo Flujo"
                        disabled={deshabilitar}
                        onClick={() => mostrarModal(item.id_tipoflujo)}
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

export default TiposFlujo
