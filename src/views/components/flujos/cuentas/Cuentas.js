import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import { getCuentas } from '../../../../services/getCuentas'
import { postCrudCuentas } from '../../../../services/postCrudCuentas'
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

const Cuentas = () => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [show, setShow] = useState(false)
  const [idCuenta, setIdCuenta] = useState(0)

  const handleClose = () => setShow(false)

  useEffect(() => {
    let mounted = true
    getCuentas(null, null).then((items) => {
      if (mounted) {
        setList(items.cuentas)
      }
    })
    return () => (mounted = false)
  }, [])

  function mostrarModal(id_cuenta) {
    setIdCuenta(id_cuenta)
    setShow(true)
  }

  async function eliminarCuenta(id_cuenta) {
    const respuesta = await postCrudCuentas(id_cuenta, '', '', '', '2')
    if (respuesta === 'OK') {
      await getCuentas(null, null).then((items) => {
        setList(items.cuentas)
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
          <Modal.Body>Está seguro de eliminar esta cuenta?</Modal.Body>
          <Modal.Footer>
            <CButton color="secondary" onClick={handleClose}>
              Cancelar
            </CButton>
            <CButton color="primary" onClick={() => eliminarCuenta(idCuenta).then(handleClose)}>
              Aceptar
            </CButton>
          </Modal.Footer>
        </Modal>
        <CTable hover responsive align="middle" className="mb-0 border">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell className="account-row">Número Cuenta</CTableHeaderCell>
              <CTableHeaderCell className="account-row">Nombre</CTableHeaderCell>
              <CTableHeaderCell className="account-row">Empresa</CTableHeaderCell>
              <CTableHeaderCell className="account-row">Banco</CTableHeaderCell>
              <CTableHeaderCell className="account-row">Moneda</CTableHeaderCell>
              <CTableHeaderCell className="account-row" style={{ width: '10%' }}>
                Código ACH
              </CTableHeaderCell>
              <CTableHeaderCell className="account-row" style={{ width: '14%' }}>
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
                  <CTableRow key={item.id_banco}>
                    <CTableDataCell className="account-row">{item.numero_cuenta}</CTableDataCell>
                    <CTableDataCell className="account-row">{item.nombre}</CTableDataCell>
                    <CTableDataCell className="account-row">{item.empresa}</CTableDataCell>
                    <CTableDataCell className="account-row">{item.banco}</CTableDataCell>
                    <CTableDataCell className="account-row">{item.moneda}</CTableDataCell>
                    <CTableDataCell className="account-row">{item.codigo_ach}</CTableDataCell>
                    <CTableDataCell className="account-row">
                      <CButton
                        color="primary"
                        size="sm"
                        title="Editar Banco"
                        onClick={() =>
                          history.push({
                            pathname: '/cuentas/editar',
                            id_cuenta: item.id_cuenta,
                            numero_cuenta: item.numero_cuenta,
                            nombre: item.nombre,
                            id_empresa: item.id_empresa,
                            id_banco: item.id_banco,
                            id_moneda: item.id_moneda,
                            codigo_ach: item.codigo_ach,
                          })
                        }
                      >
                        <FaUserEdit />
                      </CButton>{' '}
                      <CButton
                        color="danger"
                        size="sm"
                        title="Eliminar Banco"
                        onClick={() => mostrarModal(item.id_cuenta)}
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

export default Cuentas
