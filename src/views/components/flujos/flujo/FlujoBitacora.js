import React, { useState, useEffect } from 'react'
import { useSession } from 'react-use-session'
import { useHistory } from 'react-router-dom'
import { useIdleTimer } from 'react-idle-timer'
import { getBitacora } from '../../../../services/getBitacora'
import '../../../../scss/estilos.scss'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

const FlujoBitacora = (prop) => {
  const history = useHistory()
  const [show, setShow] = useState(false)
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])

  useEffect(() => {
    let mounted = true
    getBitacora(prop.id_flujo, null, session.id, null).then((items) => {
      if (mounted) {
        setList(items.bitacora)
      }
    })
    return () => (mounted = false)
  }, [])

  const handleOnIdle = (event) => {
    setShow(true)
    setOpcion(2)
    setMensaje(
      'Ya estuvo mucho tiempo sin realizar ninguna acción. Si desea continuar presione aceptar.',
    )
    console.log('last active', getLastActiveTime())
  }

  const handleOnActive = (event) => {
    console.log('time remaining', getRemainingTime())
  }

  const handleOnAction = (event) => {}

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * parseInt(session == null ? 1 : session.limiteconexion),
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500,
  })

  if (session) {
    return (
      <div>
        <CTable hover responsive align="middle" className="mb-0 border">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell className="text-center">Nombre Usuario</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Estado</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Fecha</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Nivel</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {results.map((item, i) => {
              let Nivel = '0'
              if (item.NivelAutorizo === '0' || item.NivelAutorizo === null) {
                Nivel = '0'
              } else {
                Nivel = item.NivelAutorizo
              }
              return (
                <CTableRow key={item.IdFlujoDetalle}>
                  <CTableDataCell className="text-center">
                    {item.nombre} {item.apellido}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">{item.descripcion}</CTableDataCell>
                  <CTableDataCell className="text-center">{item.Fecha}</CTableDataCell>
                  <CTableDataCell className="text-center">{Nivel}</CTableDataCell>
                </CTableRow>
              )
            })}
          </CTableBody>
        </CTable>
      </div>
    )
  } else {
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default FlujoBitacora
