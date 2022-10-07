/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useIdleTimer } from 'react-idle-timer'
import { useSession } from 'react-use-session'
import { Button, Modal } from 'react-bootstrap'
import { getPendientesValidacionReporte } from '../../../services/getPendientesValidacionReporte'
import { postSesionUsuario } from '../../../services/postSesionUsuario'
import spanish from '../../../lenguaje/es.json'
import '../../../scss/estilos.scss'

const PendientesValidacion = (prop) => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const [show, setShow] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const { session, clear } = useSession('PendrogonIT-Session')
  const handleClose = () => setShow(false)

  useEffect(() => {
    let mounted = true
    let pagos = []
    getPendientesValidacionReporte(session.id,session.api_token).then((items) => {
      if (mounted) {
        pagos.push(
          { 
            "empresa_nombre" : { type: "string" },
            "doc_num" : { type: "string"},
            "tipo" : { type: "string"},
            "doc_date" : { type: "datetime"},
            "en_favor_de" : { type: "string"},
            "comments" : { type: "string"},
            "doc_total" : { type: "number"},
            "fecha_asignacion" : { type: "datetime"},
            "nombre_usuario" : { type: "string"},
            "nivel" : { type: "string"},
            "dias" : { type: "number"},
          }
        )
        items.flujos.forEach((item) => {
          pagos.push(item)
        })
        var pivot = new WebDataRocks({
          container: '#wdr-component',
          beforetoolbarcreated: customizeToolbar,
          height: 480,
          toolbar: true,
          report: {
            dataSource: {
              data: pagos,
            },
            slice: {
              rows: [
                {
                  uniqueName: 'empresa_nombre',
                  caption: 'Empresa',
                },
                {
                  uniqueName: 'doc_num',
                  caption: 'Documento',
                },
                {
                  uniqueName: 'tipo',
                  caption: 'Tipo',
                },
                {
                  uniqueName: 'doc_date',
                  caption: 'Fecha',
                },
                {
                  uniqueName: 'en_favor_de',
                  caption: 'Beneficiario',
                },
                {
                  uniqueName: 'comments',
                  caption: 'Concepto',
                },
                {
                  uniqueName: 'doc_total',
                  caption: 'Monto',
                },
                {
                  uniqueName: 'fecha_asignacion',
                  caption: 'Fecha último movimiento',
                },
                {
                  uniqueName: 'nombre_usuario',
                  caption: 'Validador',
                },
                {
                  uniqueName: 'nivel',
                  caption: 'Nivel actual',
                },
                {
                  uniqueName: 'dias',
                  caption: 'Días',
                },
              ],
            },
            conditions: [
              {
                formula: `#value <= ${session.verde}`,
                measure: 'porcentaje',
                format: {
                  backgroundColor: '#60FB7A',
                  color: '#60FB7A',
                  fontFamily: 'Arial',
                  fontSize: '12px',
                },
              },
              {
                formula: `AND(#value > ${session.verde}, #value <= ${session.amarillo})`,
                measure: 'porcentaje',
                format: {
                  backgroundColor: '#DACF3B',
                  color: '#DACF3B',
                  fontFamily: 'Arial',
                  fontSize: '12px',
                },
              },
              {
                formula: `#value > ${session.amarillo}`,
                measure: 'porcentaje',
                format: {
                  backgroundColor: '#FC756C',
                  color: '#FC756C',
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

  function customizeToolbar(toolbar) {
    var tabs = toolbar.getTabs()
    toolbar.getTabs = function () {
      delete tabs[0]
      delete tabs[1]
      return tabs
    }
  }

  if (session) {
    return (
      <>
        <div id="wdr-component"></div>
      </>
    )
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default PendientesValidacion
