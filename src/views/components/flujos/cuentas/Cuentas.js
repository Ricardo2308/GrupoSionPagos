import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { getCuentas } from '../../../../services/getCuentas'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { useSession } from 'react-use-session'
import { FaUserEdit } from 'react-icons/fa'
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
  const [permisos, setPermisos] = useState([])

  useEffect(() => {
    let mounted = true
    getCuentas(null, null).then((items) => {
      if (mounted) {
        setList(items.cuentas)
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

  if (session) {
    let deshabilitar = false
    if (ExistePermiso('Modulo Cuentas') == 0) {
      deshabilitar = true
    }
    return (
      <>
        <div className="float-right" style={{ marginBottom: '10px' }}>
          <CButton
            color="primary"
            size="sm"
            disabled={deshabilitar}
            onClick={() => history.push('/cuentas/nueva')}
          >
            Crear Nueva
          </CButton>
        </div>
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
                        disabled={deshabilitar}
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
