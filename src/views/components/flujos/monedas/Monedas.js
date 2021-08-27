import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import { getMonedas } from '../../../../services/getMonedas'
import { postCrudMonedas } from '../../../../services/postCrudMonedas'
import { useSession } from 'react-use-session'
import { FaUserEdit, FaTrash } from 'react-icons/fa'
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

const Monedas = () => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [show, setShow] = useState(false)
  const [idMoneda, setIdMoneda] = useState(0)

  const handleClose = () => setShow(false)

  useEffect(() => {
    let mounted = true
    getMonedas(null, null).then((items) => {
      if (mounted) {
        setList(items.monedas)
      }
    })
    return () => (mounted = false)
  }, [])

  function mostrarModal(id_moneda) {
    setIdMoneda(id_moneda)
    setShow(true)
  }

  async function eliminarMoneda(id_moneda) {
    const respuesta = await postCrudMonedas(id_moneda, '', '', '', '2')
    if (respuesta === 'OK') {
      await getMonedas(null, null).then((items) => {
        setList(items.monedas)
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
          <Modal.Body>Está seguro de eliminar este tipo de moneda?</Modal.Body>
          <Modal.Footer>
            <CButton color="secondary" onClick={handleClose}>
              Cancelar
            </CButton>
            <CButton color="primary" onClick={() => eliminarMoneda(idMoneda).then(handleClose)}>
              Aceptar
            </CButton>
          </Modal.Footer>
        </Modal>
        <div className="float-right" style={{ marginBottom: '10px' }}>
          <CButton
            color="primary"
            size="sm"
            //disabled={deshabilitar}
            onClick={() => history.push('/monedas/nueva')}
          >
            Crear Nueva
          </CButton>
        </div>
        <CTable hover responsive align="middle" className="mb-0 border">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell className="text-center">Nombre</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Símbolo</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Estado</CTableHeaderCell>
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
                  <CTableRow key={item.id_banco}>
                    <CTableDataCell className="text-center">{item.nombre}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.simbolo}</CTableDataCell>
                    <CTableDataCell className="text-center">{estado}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton
                        color="primary"
                        size="sm"
                        title="Editar Banco"
                        onClick={() =>
                          history.push({
                            pathname: '/monedas/editar',
                            id_moneda: item.id_moneda,
                            nombre: item.nombre,
                            simbolo: item.simbolo,
                            estado: item.activo,
                          })
                        }
                      >
                        <FaUserEdit />
                      </CButton>{' '}
                      <CButton
                        color="danger"
                        size="sm"
                        title="Eliminar Banco"
                        onClick={() => mostrarModal(item.id_moneda)}
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

export default Monedas
