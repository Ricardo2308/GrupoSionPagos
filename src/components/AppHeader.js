import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useSession } from 'react-use-session'
import { useSelector, useDispatch } from 'react-redux'
import { FiBell, FiMenu } from 'react-icons/fi'
import { getMensajes } from '../services/getMensajes'
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

const AppHeader = () => {
  const dispatch = useDispatch()
  const [results, setList] = useState([])
  const [contador, Contar] = useState(0)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const { session } = useSession('PendrogonIT-Session')

  useEffect(() => {
    const interval = setInterval(() => {
      let cont = 0
      getMensajes(null, session.id).then((items) => {
        items.mensajes.map((item) => {
          if (item.leido === '0') {
            cont++
          }
          Contar(cont)
        })
        setList(items.mensajes)
      })
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <CHeader position="sticky" className="mb-4">
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
              <FiBell size={20} />
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

const MessageCount = (props) => {
  if (props.count === 0) {
    return null
  }
  return <div className={'new-messages-count'}>{props.count}</div>
}

export default AppHeader
