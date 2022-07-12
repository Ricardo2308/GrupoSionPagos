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
import { FiBell } from 'react-icons/fi'
import { postNotificacion } from '../../services/postNotificacion'

const NotificationDropdown = (props) => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const comentarios = ['Aprobado', 'Autorización completa']
  const comentariosR = ['Rechazado']
  const comentariosC = ['Compensado']

  async function leerNotificacion(estado, tipo, IdFlujo) {
    let pagos = []
    pagos.push(IdFlujo)
    const respuesta = await postNotificacion(pagos, session.id, '', '1', session.api_token)
    let autorizados = []
    let rechazados = []
    let compensados = []
    if (estado == 5) {
      for (let item of props.notificaciones) {
        if (item.Leido == 0 && item.estado == estado) {
          let yaExiste = autorizados.find((obj) => {
            return obj.Pago === item.Pago
          })
          if (yaExiste === undefined) {
            autorizados.push(item)
          }
        }
      }
      history.push({
        pathname: '/pagos/autorizados',
        autorizados: autorizados,
        tipo: tipo,
        comentarios: comentarios,
        opcion: 1,
      })
    } else if (estado == 6) {
      for (let item of props.notificaciones) {
        if (item.Leido == 0 && item.estado == estado) {
          let yaExiste = rechazados.find((obj) => {
            return obj.Pago === item.Pago
          })
          if (yaExiste === undefined) {
            rechazados.push(item)
          }
        }
      }
      history.push({
        pathname: '/pagos/rechazados',
        rechazados: rechazados,
        tipo: tipo,
        comentarios: comentariosR,
      })
    } else if (estado == 7) {
      for (let item of props.notificaciones) {
        if (item.Leido == 0 && item.estado == estado) {
          let yaExiste = compensados.find((obj) => {
            return obj.Pago === item.Pago
          })
          if (yaExiste === undefined) {
            compensados.push(item)
          }
        }
      }
      history.push({
        pathname: '/pagos/compensados',
        compensados: compensados,
        tipo: tipo,
        comentarios: comentariosC,
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
          {props.recordatorio && (
            <CDropdownItem
              title="Ir al recordatorios"
              key="recordatorio"
              style={{ cursor: 'pointer' }}
              onClick={() => history.push({ pathname: '/recordatoriopendiente' })}
            >
              Tiene recordatorios
            </CDropdownItem>
          )}
          {props.notificaciones.map((item, i) => {
            if (item.Leido == 0) {
              return (
                <CDropdownItem
                  title="Ir al Pago"
                  key={item.IdNotificacion}
                  style={{ cursor: 'pointer' }}
                  onClick={() => leerNotificacion(item.estado, item.tipo, item.IdFlujo)}
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
