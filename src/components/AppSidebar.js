import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useSession } from 'react-use-session'
import { Link, NavLink } from 'react-router-dom'
import {
  FiLock,
  FiSettings,
  FiCreditCard,
  FiArrowLeftCircle,
  FiArrowRightCircle,
} from 'react-icons/fi'
import { GiAbstract050 } from 'react-icons/gi'
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

import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from 'react-pro-sidebar'
import 'react-pro-sidebar/dist/css/styles.css'

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
  const [menuCollapse, setMenuCollapse] = useState(true)

  useEffect(() => {
    let mounted = true
    let permisos = []
    const menu = []
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getPerfilUsuario(idUsuario, '3', '0', session.api_token).then((items) => {
      for (const item of items.detalle) {
        permisos.push(item.objeto)
      }
      if (obtenerItems(administracion, permisos).length > 0) {
        let items = obtenerItems(administracion, eliminaDuplicados(permisos))
        menu.push(
          <SubMenu key="Administración" icon={<FiLock />} title="Administración">
            {items}
          </SubMenu>,
        )
      }
      if (obtenerItems(configuracion, permisos).length > 0) {
        let items = obtenerItems(configuracion, eliminaDuplicados(permisos))
        menu.push(
          <SubMenu key="Configuración" icon={<FiSettings />} title="Configuración">
            {items}
          </SubMenu>,
        )
      }
      if (obtenerItems(pagos, permisos).length > 0) {
        let items = obtenerItems(pagos, eliminaDuplicados(permisos))
        menu.push(
          <SubMenu key="Pagos" icon={<FiCreditCard />} title="Pagos">
            {items}
          </SubMenu>,
        )
      }
      for (let permiso of eliminaDuplicados(permisos)) {
        if (permiso == 'Seccion Reportes') {
          menu.push(reportes)
        }
      }
      setMenu(menu)
    })
    return () => (mounted = false)
  }, [])

  const eliminaDuplicados = (arr) => {
    return [...new Set(arr)]
  }

  const menuIconClick = () => {
    menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true)
  }

  function obtenerItems(items, objetos) {
    const array = []
    for (let objeto of objetos) {
      for (let item of items) {
        if (item.objeto == objeto) {
          array.push(item.menu)
        }
      }
    }
    return array
  }

  if (session) {
    return (
      <ProSidebar collapsed={menuCollapse}>
        <SidebarHeader
          style={{
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: '14px',
          }}
          to="/"
        >
          {menuCollapse ? (
            <>
              <span>CP</span>
              <br />
              <GiAbstract050 />
            </>
          ) : (
            <>
              <br />
              <h6>CONTROL DE PAGOS</h6>
              {session.user_name}
              <br />
              <br />
            </>
          )}
        </SidebarHeader>
        <SidebarContent
          style={{
            position: 'sticky',
            top: 0,
            left: 0,
          }}
        >
          <Menu>
            <MenuItem>
              <img src={logo} style={{ width: '15px', marginRight: '18px', marginLeft: '10px' }} />
              Dashboard
              <Link to="/dashboard" />
            </MenuItem>
            {menu}
          </Menu>
        </SidebarContent>
        <SidebarFooter>
          <div className="closemenu" onClick={menuIconClick}>
            {menuCollapse ? <FiArrowRightCircle /> : <FiArrowLeftCircle />}
          </div>
        </SidebarFooter>
      </ProSidebar>
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
