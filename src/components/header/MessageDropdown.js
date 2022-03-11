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
  const comentarios = ['Aprobado', 'Autorización completa']

  async function responderMensajes(tipo) {
    let mensajes = []
    for (let item of props.mensajes) {
      if (item.tipo == tipo && item.leido == 0) {
        mensajes.push(item)
      }
    }
    history.push({
      pathname: '/pagos/autorizados',
      comentarios: comentarios,
      tipo: tipo,
      autorizados: mensajes,
      opcion: 2,
    })
  }

  if (session) {
    return (
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0" caret={true}>
          <FiMail size={20} />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-light fw-semibold py-2">Mensajes</CDropdownHeader>
          {props.mensajes.map((item, i) => {
            if (item.leido == 0) {
              return (
                <CDropdownItem
                  title="Ir al Pago"
                  key={item.id_mensaje}
                  style={{ cursor: 'pointer' }}
                  onClick={() => responderMensajes(item.tipo)}
                >
                  {item.usuarioenvia}
                  {'->'}
                  {item.Pago}
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
