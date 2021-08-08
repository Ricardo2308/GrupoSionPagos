import React from 'react'
import { useSession } from 'react-use-session'
import { useHistory } from 'react-router-dom'
import {
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { FiUser, FiPower } from 'react-icons/fi'
import { FaUserCircle } from 'react-icons/fa'

const AppHeaderDropdown = () => {
  const history = useHistory()
  const { session, clear } = useSession('PendrogonIT-Session')

  const salir = (e) => {
    clear()
    history.push('/#')
  }

  if (session) {
    return (
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0" caret={true}>
          <FaUserCircle size={20} />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-light fw-semibold py-2">Cuenta</CDropdownHeader>
          <CDropdownHeader>{session.name}</CDropdownHeader>
          <CDropdownHeader>{session.user_name}</CDropdownHeader>
          <CDropdownItem
            title="Ir al Perfil"
            onClick={() =>
              history.push({
                pathname: '/base/consulta',
                id_usuario: session.id,
                nombre: session.name,
                estado: session.estado,
                inhabilitar: true,
              })
            }
          >
            <FiUser style={{ marginRight: '5px' }} />
            Perfil
          </CDropdownItem>
          <CDropdownItem title="Cerrar Sesión" onClick={() => salir()}>
            <FiPower style={{ marginRight: '5px' }} />
            Salir
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    )
  } else {
    return (
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0" caret={false} disabled={true}>
          <FaUserCircle size={20} />
        </CDropdownToggle>
      </CDropdown>
    )
  }
}

export default AppHeaderDropdown
