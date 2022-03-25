import React, { useState, useEffect } from 'react'
import { useSession } from 'react-use-session'
import { useHistory } from 'react-router-dom'
import { getBitacora, getFlujoProceso } from '../../../../services/getBitacora'
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
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [flujoProceso, setListFlujoProceso] = useState([])

  useEffect(() => {
    let mounted = true
    getBitacora(prop.id_flujo).then((items) => {
      if (mounted) {
        setList(items.bitacora)
      }
    })
    getFlujoProceso(prop.id_flujo).then((items) => {
      if (mounted) {
        setListFlujoProceso(items.flujo)
      }
    })
    return () => (mounted = false)
  }, [])

  if (session) {
    return (
      <>
        <div>
          <h4 style={{ marginLeft: '10px' }}>Flujo de pago</h4>
          <br />
          <CTable hover responsive align="middle" className="mb-0 border">
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell className="text-center">Pasos</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Acción</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Responsable</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Usuario</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {flujoProceso.map((item, i) => {
                return (
                  <CTableRow key={i}>
                    <CTableDataCell className="text-center">{item.descripcion}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      {item.accion} {item.nivel}
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      {item.nombre} {item.apellido}
                    </CTableDataCell>
                    <CTableDataCell className="text-center">{item.nombre_usuario}</CTableDataCell>
                  </CTableRow>
                )
              })}
            </CTableBody>
          </CTable>
        </div>
        <br />
        <div style={{ marginLeft: '10px' }}>
          <h4>Bitácora de acciones</h4>
          <br />
          <CTable hover responsive align="middle" className="mb-0 border">
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell className="text-center">Nombre Usuario</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Estado</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Fecha</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Nivel</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Comentario</CTableHeaderCell>
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
                    <CTableDataCell className="text-center">{item.Comentario}</CTableDataCell>
                  </CTableRow>
                )
              })}
            </CTableBody>
          </CTable>
        </div>
      </>
    )
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default FlujoBitacora
