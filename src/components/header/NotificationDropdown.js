import React from 'react'
import { useSession } from 'react-use-session'
import { useHistory } from 'react-router-dom'
import { postNotificacion } from '../../services/postNotificacion'
import {
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { FiBell } from 'react-icons/fi'

const NotificationDropdown = (props) => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')

  async function leerNotificacion(estado, tipo) {
    let autorizados = []
    let rechazados = []
    if (estado == 5) {
      for (let item of props.notificaciones) {
        if (item.Leido == 0 && item.estado == estado && item.tipo == tipo) {
          autorizados.push(item)
        }
      }
      history.push({
        pathname: '/pagos/autorizados',
        autorizados: autorizados,
        tipo: tipo,
        comentario: 'Aprobado',
      })
    } else if (estado == 6) {
      for (let item of props.notificaciones) {
        if (item.Leido == 0 && item.estado == estado && item.tipo == tipo) {
          rechazados.push(item)
        }
      }
      history.push({
        pathname: '/pagos/rechazados',
        rechazados: rechazados,
        tipo: tipo,
        comentario: 'Rechazado',
      })
    }
  }

  if (session) {
    return (
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0" caret={true}>
          <FiBell size={20} />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-light fw-semibold py-2">Notificaciones</CDropdownHeader>
          {props.notificaciones.map((item, i) => {
            if (item.Leido === '0') {
              return (
                <CDropdownItem
                  title="Ir al Pago"
                  key={item.IdNotificacion}
                  onClick={() => leerNotificacion(item.estado, item.tipo)}
                >
                  {item.Mensaje}
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
          <FiBell size={20} />
        </CDropdownToggle>
      </CDropdown>
    )
  }
}

export default NotificationDropdown
