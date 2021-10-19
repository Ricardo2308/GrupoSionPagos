import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { getSesionUsuario } from '../../../../services/getSesionUsuario'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { useSession } from 'react-use-session'
import { FaList } from 'react-icons/fa'
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

const Conectados = () => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])

  useEffect(() => {
    let mounted = true
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getSesionUsuario(null).then((items) => {
      if (mounted) {
        setList(items.sesiones)
      }
    })
    getPerfilUsuario(idUsuario, '2').then((items) => {
      if (mounted) {
        setPermisos(items.detalle)
      }
    })
    window.addEventListener('beforeunload', (ev) => {
      console.log(ev)
      ev.preventDefault()
      return (ev.returnValue = 'Esta seguro de cerrar sesión?')
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

  if (session) {
    let deshabilitar = false
    if (!ExistePermiso('Modulo Conectados')) {
      deshabilitar = true
    }
    return (
      <>
        <CTable hover responsive align="middle" className="mb-0 border">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell className="text-center">Usuario</CTableHeaderCell>
              <CTableHeaderCell className="text-center">IP</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Navegador</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Hora Inicio</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {results.map((item, i) => {
              if (item.IdUsuario != session.id) {
                return (
                  <CTableRow key={item.IdUsuario}>
                    <CTableDataCell className="text-center">{item.NombreUsuario}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.IPAddress}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.Navegador}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.FechaHoraInicio}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton
                        color="primary"
                        size="sm"
                        title="Histórico Usuario"
                        //disabled={deshabilitar}
                        onClick={() =>
                          history.push({
                            pathname: '/conectados/historico',
                            IdUsuario: item.IdUsuario,
                            NombreUsuario: item.NombreUsuario,
                          })
                        }
                      >
                        <FaList />
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

export default Conectados
