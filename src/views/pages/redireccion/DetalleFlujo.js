import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useSession } from 'react-use-session'
import { getDetalle } from '../../../services/getDetalle'

const DetalleFlujo = () => {
  const history = useHistory()
  const { id_flujo } = useParams()
  const { session, clear } = useSession('PendrogonIT-Session')

  if (session) {
    getDetalle(id_flujo, session.api_token).then((items) => {
      let datosOrdenados = []
      datosOrdenados.push({
        id_flujo: items.flujos[0].id_flujo,
        estado: items.flujos[0].estado,
        nivel: items.flujos[0].nivel,
        id_grupo: items.flujos[0].id_grupoautorizacion,
        PuedoAutorizar: 1,
        pago: items.flujos[0].doc_num,
        seccion: 'Pendientes',
      })
      sessionStorage.setItem('listaPagos', JSON.stringify(datosOrdenados))
      history.push({
        pathname: '/pagos/tabs',
        id_flujo: items.flujos[0].id_flujo,
        pago: items.flujos[0].doc_num,
        estado: items.flujos[0].estado,
        nivel: items.flujos[0].nivel,
        id_grupo: items.flujos[0].id_grupoautorizacion,
        PuedoAutorizar: 1,
        pagina: 'transferencia',
        seccion: 'Pendientes',
      })
    })
  } else {
    history.push({
      pathname: '/',
      id_flujo: id_flujo,
    })
  }
  return <></>
}

export default DetalleFlujo
