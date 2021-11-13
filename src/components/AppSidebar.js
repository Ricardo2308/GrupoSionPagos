import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useSession } from 'react-use-session'
import { useHistory } from 'react-router-dom'
import { BiUserCircle } from 'react-icons/bi'
import { RiBankLine } from 'react-icons/ri'
import { FaCoins } from 'react-icons/fa'
import logo from '../assets/icons/GrupoSion.png'
import {
  CSidebar,
  CSidebarHeader,
  CSidebarNav,
  CCreateNavItem,
  CSidebarToggler,
  CNavItem,
  CNavTitle,
  CNavGroup,
  CNavLink,
} from '@coreui/react'

import {
  FiBook,
  FiLock,
  FiSettings,
  FiGitPullRequest,
  FiUserCheck,
  FiUsers,
  FiGrid,
  FiAlertOctagon,
  FiFile,
  FiThumbsUp,
  FiCreditCard,
} from 'react-icons/fi'

//import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
//import navigation from '../_nav'

const AppSidebar = () => {
  const history = useHistory()
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
        {/*
        <CSidebarNav>
          <SimpleBar>
            <CCreateNavItem>HOLA</CCreateNavItem>
            <CCreateNavItem items={navigation} />
          </SimpleBar>
        </CSidebarNav>
        */}
        <CSidebarNav>
          <CNavItem>
            <CNavLink href="#/dashboard">
              <img src={logo} style={{ width: '15%', marginRight: '15px', marginLeft: '30px' }} />
              Dashboard
            </CNavLink>
          </CNavItem>
          <CNavTitle>Módulos</CNavTitle>
          <CNavGroup
            toggler="Seguridad"
            icon={<FiLock size={20} style={{ marginRight: '20px', marginLeft: '7px' }} />}
          >
            <CNavItem>
              <CNavLink href="#/usuarios">
                <FiUsers size={16} style={{ marginRight: '4px' }} />
                Usuarios
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#/conectados">
                <FiUsers size={16} style={{ marginRight: '4px' }} />
                Conectados
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#/perfiles">
                <BiUserCircle size={18} style={{ marginRight: '4px' }} />
                Perfiles
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#/roles">
                <FiSettings size={16} style={{ marginRight: '4px' }} />
                Roles
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#/permisos">
                <FiUserCheck size={16} style={{ marginRight: '4px' }} />
                Permisos
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#/politicas">
                <FiBook size={16} style={{ marginRight: '4px' }} />
                Políticas
              </CNavLink>
            </CNavItem>
          </CNavGroup>
          <CNavGroup
            toggler="Pagos"
            type="NavLink"
            icon={<FiCreditCard size={20} style={{ marginRight: '20px', marginLeft: '7px' }} />}
          >
            <CNavItem>
              <CNavLink href="#/condiciones">
                <FiAlertOctagon size={16} style={{ marginRight: '4px' }} />
                Condiciones
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#/grupos">
                <FiUsers size={16} style={{ marginRight: '4px' }} />
                Grupos
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#/autorizacion">
                <FiThumbsUp size={16} style={{ marginRight: '4px' }} />
                Autorizacion
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#/estadosflujo">
                <FiGrid size={16} style={{ marginRight: '4px' }} />
                Estado Pago
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#/tipoflujo">
                <FiGitPullRequest size={16} style={{ marginRight: '4px' }} />
                Tipo Flujo
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#/archivoflujo">
                <FiFile size={16} style={{ marginRight: '4px' }} />
                Archivos Pago
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#/bancos">
                <RiBankLine size={18} style={{ marginRight: '4px' }} />
                Bancos
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#/monedas">
                <FaCoins size={16} style={{ marginRight: '4px' }} />
                Monedas
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#/cuentas">
                <FiCreditCard size={16} style={{ marginRight: '4px' }} />
                Cuentas
              </CNavLink>
            </CNavItem>
            <CNavGroup
              toggler="Autorizar Pagos"
              type="NavLink"
              icon={<FiCreditCard size={16} style={{ marginRight: '4px' }} />}
            >
              <CNavItem>
                <CNavLink href="#/pagos/bancario">Bancaria</CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="#/pagos/transferencia">Transferencia</CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="#/pagos/interna">Interna</CNavLink>
              </CNavItem>
            </CNavGroup>
            <CNavGroup
              toggler="Compensar Pagos"
              type="NavLink"
              icon={<FiCreditCard size={16} style={{ marginRight: '4px' }} />}
            >
              <CNavItem>
                <CNavLink href="#/compensacion/bancario">Bancaria</CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="#/compensacion/transferencia">Transferencia</CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="#/compensacion/interna">Interna</CNavLink>
              </CNavItem>
            </CNavGroup>
          </CNavGroup>
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
