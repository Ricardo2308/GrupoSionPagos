/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { getPendientesReporte } from '../../../services/getPendientesReporte'
import { useSession } from 'react-use-session'
import spanish from '../../../lenguaje/es.json'
import '../../../scss/estilos.scss'

const Pendientes = (prop) => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [politicas, setPoliticas] = useState([])

  useEffect(() => {
    let mounted = true
    let pagos = []
    getPendientesReporte().then((items) => {
      if (mounted) {
        pagos.push(items.flujos)
        var pivot = new WebDataRocks({
          container: '#wdr-component',
          height: 480,
          toolbar: true,
          report: {
            dataSource: {
              data: items.flujos,
            },
            slice: {
              rows: [
                {
                  uniqueName: 'doc_num',
                  caption: 'Documento',
                },
                {
                  uniqueName: 'doc_date',
                  caption: 'Fecha',
                },
                {
                  uniqueName: 'comments',
                  caption: 'Detalle',
                },
                {
                  uniqueName: 'tipo',
                  caption: 'Tipo',
                },
                {
                  uniqueName: 'estado',
                  caption: 'Estado',
                },
                {
                  uniqueName: 'dias_credito',
                  caption: 'Días Crédito',
                },
                {
                  uniqueName: 'dias_vencimiento',
                  caption: 'Días Vencimiento',
                },
                {
                  uniqueName: 'porcentaje',
                  caption: 'Semáforo',
                },
              ],
            },
            conditions: [
              {
                formula: `#value <= ${session.verde}`,
                measure: 'porcentaje',
                format: {
                  backgroundColor: '#DAFDDA',
                  fontFamily: 'Arial',
                  fontSize: '12px',
                },
              },
              {
                formula: `AND(#value > ${session.verde}, #value <= ${session.amarillo})`,
                measure: 'porcentaje',
                format: {
                  backgroundColor: '#F6FAD0',
                  fontFamily: 'Arial',
                  fontSize: '12px',
                },
              },
              {
                formula: `#value > ${session.amarillo}`,
                measure: 'porcentaje',
                format: {
                  backgroundColor: '#FBE0E0',
                  fontFamily: 'Arial',
                  fontSize: '12px',
                },
              },
            ],
            options: {
              grid: {
                type: 'flat',
                showTotals: 'off',
                showGrandTotals: 'off',
              },
              showEmptyData: false,
            },
            formats: [
              {
                name: '4ktymhkg',
                thousandsSeparator: ' ',
                decimalSeparator: '.',
                currencySymbol: '',
                currencySymbolAlign: 'left',
                nullValue: '',
                textAlign: 'center',
                isPercent: true,
              },
            ],
          },
          global: {
            localization: spanish,
          },
        })
      }
    })
    return () => (mounted = false)
  }, [])

  if (session) {
    return (
      <div id="wdr-component"></div>
    )
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default Pendientes
