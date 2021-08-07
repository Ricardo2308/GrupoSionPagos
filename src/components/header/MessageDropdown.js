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
import { FiMail } from 'react-icons/fi'

const MessageDropdown = (props) => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')

  if (session) {
    return (
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0" caret={true}>
          <FiMail size={20} />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-light fw-semibold py-2">Mensajes</CDropdownHeader>
          {props.mensajes.map((item, i) => {
            if (item.leido === '0') {
              return (
                <CDropdownItem
                  key={item.id_mensaje}
                  onClick={() =>
                    history.push({
                      pathname: '/pagos/tabs',
                      id_flujo: item.id_flujo,
                      pago: item.pago,
                      id_usuario: session.id,
                    })
                  }
                >
                  {item.usuarioenvia}
                  {'->'}
                  {item.pago}
                  {'->"'}
                  {item.mensaje}
                  {'"'}
                </CDropdownItem>
              )
            }
          })}
        </CDropdownMenu>
      </CDropdown>
    )
  } else {
    return (
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0" caret={false} disabled={true}>
          <FiMail size={20} />
        </CDropdownToggle>
      </CDropdown>
    )
  }
}

export default MessageDropdown
