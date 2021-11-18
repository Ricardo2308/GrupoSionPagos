import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useSession } from 'react-use-session'
import { NavLink } from 'react-router-dom'
import { FaRegChartBar } from 'react-icons/fa'
import { FiLock, FiSettings, FiCreditCard } from 'react-icons/fi'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import logo from '../assets/icons/GrupoSion.png'
import { getPerfilUsuario } from '../services/getPerfilUsuario'
import {
  CSidebar,
  CSidebarHeader,
  CSidebarNav,
  CCreateNavItem,
  CSidebarToggler,
  CNavItem,
  CNavTitle,
  CNavLink,
} from '@coreui/react'

// sidebar nav config
//import navigation from '../secciones/_nav'
import administracion from '../secciones/administracion'
import configuracion from '../secciones/configuracion'
import pagos from '../secciones/pagos'
import reportes from '../secciones/reportes'

const AppSidebar = () => {
  const { session } = useSession('PendrogonIT-Session')
  const [menu, setMenu] = useState([])
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  useEffect(() => {
    let mounted = true
    let permisos = []
    const menu = []
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getPerfilUsuario(idUsuario, '3', '0').then((items) => {
      for (const item of items.detalle) {
        permisos.push(item.objeto)
      }
      if (obtenerItems(administracion, permisos).length > 0) {
        menu.push({
          _component: 'CNavGroup',
          as: NavLink,
          anchor: 'Administración',
          to: '/to',
          icon: <FiLock size={20} style={{ marginRight: '20px', marginLeft: '7px' }} />,
          items: obtenerItems(administracion, permisos),
        })
      }
      if (obtenerItems(configuracion, permisos).length > 0) {
        menu.push({
          _component: 'CNavGroup',
          as: NavLink,
          anchor: 'Configuración',
          to: '/to',
          icon: <FiSettings size={20} style={{ marginRight: '20px', marginLeft: '7px' }} />,
          items: obtenerItems(configuracion, permisos),
        })
      }
      if (obtenerItems(pagos, permisos).length > 0) {
        menu.push({
          _component: 'CNavGroup',
          as: NavLink,
          anchor: 'Pagos',
          to: '/to',
          icon: <FiCreditCard size={20} style={{ marginRight: '20px', marginLeft: '7px' }} />,
          items: obtenerItems(pagos, eliminaDuplicados(permisos)),
        })
      }
      if (reportes.length > 0) {
        menu.push({
          _component: 'CNavGroup',
          as: NavLink,
          anchor: 'Reportes',
          to: '/to',
          icon: <FaRegChartBar size={20} style={{ marginRight: '20px', marginLeft: '7px' }} />,
          items: reportes,
        })
      }
      setMenu(menu)
    })
    return () => (mounted = false)
  }, [])

  const eliminaDuplicados = (arr) => {
    return [...new Set(arr)]
  }

  function obtenerItems(items, objetos) {
    const array = []
    for (let objeto of objetos) {
      for (let item of items) {
        if (item.objeto == objeto) {
          array.push(item)
        }
      }
    }
    return array
  }

  if (session) {
    return (
      <CSidebar
        position="fixed"
        selfHiding="md"
        unfoldable={unfoldable}
        show={sidebarShow}
        onShow={() => console.log('show')}
        onHide={() => {
          dispatch({ type: 'set', sidebarShow: false })
        }}
      >
        <CSidebarHeader style={{ fontWeight: 'bold', textAlign: 'center' }} to="/">
          CONTROL DE PAGOS
          <br />
          {session.user_name}
        </CSidebarHeader>
        <CSidebarNav>
          <SimpleBar>
            <CNavItem>
              <CNavLink href="#/dashboard">
                <img src={logo} style={{ width: '15%', marginRight: '15px', marginLeft: '30px' }} />
                Dashboard
              </CNavLink>
            </CNavItem>
            <CNavTitle>Módulos</CNavTitle>
            <CCreateNavItem items={menu} />
          </SimpleBar>
        </CSidebarNav>
        <CSidebarToggler
          className="d-none d-lg-flex"
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebar>
    )
  } else {
    return (
      <CSidebar
        position="fixed"
        selfHiding="md"
        unfoldable={unfoldable}
        show={sidebarShow}
        onShow={() => console.log('show')}
        onHide={() => {
          dispatch({ type: 'set', sidebarShow: false })
        }}
      >
        <CSidebarHeader style={{ fontWeight: 'bold', textAlign: 'center' }} to="/">
          CONTROL DE PAGOS
          <br />
          Sin sesión activa
        </CSidebarHeader>
      </CSidebar>
    )
  }
}

export default React.memo(AppSidebar)
