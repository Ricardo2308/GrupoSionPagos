import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useSession } from 'react-use-session'
import { useSelector, useDispatch } from 'react-redux'
import { FiMenu } from 'react-icons/fi'
import { getMensajes } from '../services/getMensajes'
import { getNotificaciones } from '../services/getNotificaciones'
import '../chat/src/styles/launcher.css'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
} from '@coreui/react'

import { AppBreadcrumb } from './index'

import { AppHeaderDropdown } from './header/index'
import { MessageDropdown } from './header/index'
import { NotificationDropdown } from './header/index'

const AppHeader = () => {
  const dispatch = useDispatch()
  const [results, setList] = useState([])
  const [notificaciones, setNotificaciones] = useState([])
  const [contador, Contar] = useState(0)
  const [contadorN, ContarN] = useState(0)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const { session } = useSession('PendrogonIT-Session')

  useEffect(() => {
    let cont = 0
    let contN = 0
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getMensajes(null, idUsuario).then((items) => {
      for (let item of items.mensajes) {
        if (item.leido == 0) {
          cont++
        }
      }
      Contar(cont)
      setList(items.mensajes)
    })
    getNotificaciones(null, idUsuario).then((items) => {
      for (let item of items.notificaciones) {
        if (item.Leido == 0) {
          contN++
        }
      }
      ContarN(contN)
      setNotificaciones(items.notificaciones)
    })
    const interval = setInterval(() => {
      let cont = 0
      let contN = 0
      let idUsuario = 0
      if (session) {
        idUsuario = session.id
      }
      getMensajes(null, idUsuario).then((items) => {
        for (let item of items.mensajes) {
          if (item.leido == 0) {
            cont++
          }
        }
        Contar(cont)
        setList(items.mensajes)
      })
      getNotificaciones(null, idUsuario).then((items) => {
        for (let item of items.notificaciones) {
          if (item.Leido == 0) {
            contN++
          }
        }
        ContarN(contN)
        setNotificaciones(items.notificaciones)
      })
    }, 20000)
    return () => clearInterval(interval)
  }, [])

  return (
    <CHeader position="sticky" className="mb-2">
      <CContainer fluid>
        <CHeaderToggler
          className="ms-md-3 d-lg-none"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <FiMenu size={20} />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          Dashboard
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem>
            <CNavLink to="/dashboard" component={NavLink} activeClassName="active">
              Dashboard
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav title="Mensajes Pagos">
          <CNavItem>
            <CNavLink>
              <NotificationDropdown notificaciones={notificaciones} />
              <NotificationsCount count={contadorN} />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink>
              <MessageDropdown mensajes={results} />
              <MessageCount count={contador} />
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav title="Perfil Usuario">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

const NotificationsCount = (props) => {
  if (props.count === 0) {
    return null
  }
  return <div className={'new-messages-count'}>{props.count}</div>
}

const MessageCount = (props) => {
  if (props.count === 0) {
    return null
  }
  return <div className={'new-messages-count'}>{props.count}</div>
}

export default AppHeader
