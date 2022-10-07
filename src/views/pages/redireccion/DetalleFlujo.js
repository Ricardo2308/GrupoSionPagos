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
      let banderaPuedoAutorizar = 0
      session.grupos.forEach((element) => {
        console.log(element)
        if (element.id_grupoautorizacion == items.flujos[0].id_grupoautorizacion) {
          if (items.flujos[0].estado == 4 && items.flujos[0].nivel == element.nivel) {
            banderaPuedoAutorizar = 1
          }
          if (items.flujos[0].estado == 3 && element.nivel == 1) {
            banderaPuedoAutorizar = 1
          }
        }
      })
      let datosOrdenados = []
      datosOrdenados.push({
        id_flujo: items.flujos[0].id_flujo,
        estado: items.flujos[0].estado,
        nivel: items.flujos[0].nivel,
        id_grupo: items.flujos[0].id_grupoautorizacion,
        PuedoAutorizar: banderaPuedoAutorizar,
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
        PuedoAutorizar: banderaPuedoAutorizar,
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
