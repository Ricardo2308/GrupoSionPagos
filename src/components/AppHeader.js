import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useSession } from 'react-use-session'
import { useSelector, useDispatch } from 'react-redux'
import { FiMenu } from 'react-icons/fi'
import { getMensajesRecibidos } from '../services/getMensajesRecibidos'
import { getNotificaciones } from '../services/getNotificaciones'
import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { MessageDropdown } from './header/index'
import { NotificationDropdown } from './header/index'
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

const AppHeader = () => {
  const dispatch = useDispatch()
  const [mensajes, setMensajes] = useState([])
  const [notificaciones, setNotificaciones] = useState([])
  const [contadorM, ContarM] = useState(0)
  const [contadorN, ContarN] = useState(0)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const { session } = useSession('PendrogonIT-Session')

  useEffect(() => {
    let contM = 0
    let contN = 0
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getMensajesRecibidos(idUsuario).then((items) => {
      if (items.mensajes !== undefined) {
        for (let item of items.mensajes) {
          if (item.leido == 0) {
            contM++
          }
        }
        ContarM(contM)
        setMensajes(items.mensajes)
      }
    })
    getNotificaciones(null, idUsuario).then((items) => {
      if (items.notificaciones !== undefined) {
        for (let item of items.notificaciones) {
          if (item.Leido == 0) {
            contN++
          }
        }
        ContarN(contN)
        setNotificaciones(items.notificaciones)
      }
    })
    const interval = setInterval(() => {
      let contM = 0
      let contN = 0
      let idUsuario = 0
      if (session) {
        idUsuario = session.id
      }
      getMensajesRecibidos(idUsuario).then((items) => {
        if (items.mensajes !== undefined) {
          for (let item of items.mensajes) {
            if (item.leido == 0) {
              contM++
            }
          }
          ContarM(contM)
          setMensajes(items.mensajes)
        }
      })
      getNotificaciones(null, idUsuario).then((items) => {
        if (items.notificaciones !== undefined) {
          for (let item of items.notificaciones) {
            if (item.Leido == 0) {
              contN++
            }
          }
          ContarN(contN)
          setNotificaciones(items.notificaciones)
        }
      })
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <CHeader position="sticky" className="mb-2">
      <CContainer fluid>
        <CHeaderToggler
          className="ms-md-3 d-lg-none"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        ></CHeaderToggler>
        <CHeaderBrand>
          <AppBreadcrumb />
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem></CNavItem>
        </CHeaderNav>
        <CHeaderNav title="Notificaciones Pagos">
          <NotificationDropdown notificaciones={notificaciones} />
          <NotificationsCount count={contadorN} />
        </CHeaderNav>
        <CHeaderNav title="Mensajes Pagos">
          <MessageDropdown mensajes={mensajes} />
          <MessageCount count={contadorM} />
        </CHeaderNav>
        <CHeaderNav title="Perfil Usuario">
          <AppHeaderDropdown />
        </CHeaderNav>
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
