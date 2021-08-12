import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import { getBancos } from '../../../../services/getBancos'
import { postCrudBancos } from '../../../../services/postCrudBancos'
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

const Bancos = () => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [show, setShow] = useState(false)
  const [idBanco, setIdBanco] = useState(0)

  const handleClose = () => setShow(false)

  useEffect(() => {
    let mounted = true
    getBancos(null, null).then((items) => {
      if (mounted) {
        setList(items.bancos)
      }
    })
    return () => (mounted = false)
  }, [])

  function mostrarModal(id_banco) {
    setIdBanco(id_banco)
    setShow(true)
  }

  async function eliminarBanco(id_banco) {
    const respuesta = await postCrudBancos(id_banco, '', '', '', '2')
    if (respuesta === 'OK') {
      await getBancos(null, null).then((items) => {
        setList(items.bancos)
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
          <Modal.Body>Está seguro de eliminar este banco?</Modal.Body>
          <Modal.Footer>
            <CButton color="secondary" onClick={handleClose}>
              Cancelar
            </CButton>
            <CButton color="primary" onClick={() => eliminarBanco(idBanco).then(handleClose)}>
              Aceptar
            </CButton>
          </Modal.Footer>
        </Modal>
        <CTable hover responsive align="middle" className="mb-0 border">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell className="text-center">Nombre</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Dirección</CTableHeaderCell>
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
                    <CTableDataCell className="text-center">{item.direccion}</CTableDataCell>
                    <CTableDataCell className="text-center">{estado}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton
                        color="primary"
                        size="sm"
                        title="Editar Banco"
                        onClick={() =>
                          history.push({
                            pathname: '/bancos/editar',
                            id_banco: item.id_banco,
                            nombre: item.nombre,
                            direccion: item.direccion,
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
                        onClick={() => mostrarModal(item.id_banco)}
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

export default Bancos
