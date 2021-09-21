import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useSession } from 'react-use-session'

import {
  CSidebar,
  CSidebarHeader,
  CSidebarNav,
  CSidebarToggler,
  CCreateNavItem,
} from '@coreui/react'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import navigation from '../_nav'
import seguridad from '../_seguridadnav'

const AppSidebar = () => {
  const { session } = useSession('PendrogonIT-Session')
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  if (session) {
    //if (session.perfil === 'Administrador') {
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
            <CCreateNavItem items={navigation} />
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
