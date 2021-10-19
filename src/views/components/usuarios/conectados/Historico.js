import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { getSesionUsuario } from '../../../../services/getSesionUsuario'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { useSession } from 'react-use-session'
import { FaTrash, FaPen, FaUsersCog } from 'react-icons/fa'
import { BsToggles } from 'react-icons/bs'
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

const Historico = () => {
  const history = useHistory()
  const location = useLocation()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])
  const [show, setShow] = useState(false)
  const [idPerfil, setIdPerfil] = useState(0)
  const [estado, setEstado] = useState(0)
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')

  const handleClose = () => setShow(false)

  useEffect(() => {
    let mounted = true
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    if (location.IdUsuario) {
      idUsuario = location.IdUsuario
    }
    getSesionUsuario(location.IdUsuario).then((items) => {
      if (mounted) {
        setList(items.sesiones)
      }
    })
    getPerfilUsuario(idUsuario, '2').then((items) => {
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

  if (session) {
    if (location.IdUsuario) {
      return (
        <>
          <div className="user-name-profile">{location.NombreUsuario}</div>
          <CTable hover responsive align="middle" className="mb-0 border">
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell className="text-center">Navegador</CTableHeaderCell>
                <CTableHeaderCell className="text-center">IP Usuario</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Inicio Sesión</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Fin Sesión</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {results.map((item, i) => {
                return (
                  <CTableRow key={item.IdSesion}>
                    <CTableDataCell className="text-center">{item.Navegador}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.IPAddress}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.FechaHoraInicio}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.FechaHoraFinal}</CTableDataCell>
                  </CTableRow>
                )
              })}
            </CTableBody>
          </CTable>
        </>
      )
    } else {
      history.push('/conectados')
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

export default Historico
