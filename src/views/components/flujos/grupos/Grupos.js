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
import { getGruposAutorizacion } from '../../../../services/getGruposAutorizacion'
import { postGruposAutorizacion } from '../../../../services/postGruposAutorizacion'
import { useSession } from 'react-use-session'
import { FaPen, FaTrash } from 'react-icons/fa'
import '../../../../scss/estilos.scss'

const GruposAutorizacion = () => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [show, setShow] = useState(false)
  const [idGrupo, setIdGrupo] = useState(0)

  const handleClose = () => setShow(false)

  useEffect(() => {
    let mounted = true
    getGruposAutorizacion(null, null).then((items) => {
      if (mounted) {
        setList(items.grupos)
        console.log(items)
      }
    })
    return () => (mounted = false)
  }, [])

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
        <CTable hover responsive align="middle" className="mb-0 border">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell className="text-center">Grupo Autorización</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Grupo Padre</CTableHeaderCell>
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
              let asignacion = ''
              if (item.estado_eliminado !== '1') {
                if (item.estado_activo === '1') {
                  estado = 'Activo'
                }
                if (item.id_grupopadre === '' || item.id_grupopadre === '0') {
                  asignacion = 'No asignado'
                } else {
                  asignacion = item.grupopadre
                }
                return (
                  <CTableRow key={item.id_grupo}>
                    <CTableDataCell className="text-center">{item.identificador}</CTableDataCell>
                    <CTableDataCell className="text-center">{asignacion}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.descripcion}</CTableDataCell>
                    <CTableDataCell className="text-center">{estado}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton
                        color="primary"
                        size="sm"
                        onClick={() =>
                          history.push({
                            pathname: '/grupos/editar',
                            id_grupo: item.id_grupo,
                            id_grupopadre: item.id_grupopadre,
                            identificador: item.identificador,
                            descripcion: item.descripcion,
                            estado: item.estado_activo,
                          })
                        }
                      >
                        <FaPen />
                      </CButton>{' '}
                      <CButton color="danger" size="sm" onClick={() => mostrarModal(item.id_grupo)}>
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
