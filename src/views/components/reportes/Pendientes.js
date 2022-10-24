/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSession } from 'react-use-session'
import { Button, Modal } from 'react-bootstrap'
import { getPendientesReporte } from '../../../services/getPendientesReporte'
import spanish from '../../../lenguaje/es.json'
import '../../../scss/estilos.scss'
import { CFormSelect } from '@coreui/react'
import { FaSearch } from 'react-icons/fa'

const Pendientes = (prop) => {
  const history = useHistory()
  const { session, clear } = useSession('PendrogonIT-Session')
  const [years, setYears] = useState([])
  const [datosReporte, setDatosReporte] = useState([])

  const [form, setValues] = useState({
    year: '0',
    mes: '0',
  })

  useEffect(() => {
    let mounted = true
    let years = []
    for (var i = 0; i < 30; i++) {
      years.push(2021 + i)
    }
    setYears(years)
    let pagos = []
    getPendientesReporte(session.id, form.year, form.mes, session.api_token).then((items) => {
      if (mounted) {
        pagos.push(
          { 
            "doc_num" : { type: "string"},
            "tipo" : { type: "string"},
            "doc_date" : { type: "date string"},
            "comments" : { type: "string"},
            "estado" : { type: "string"},
            "doc_total" : { type: "number", format: 'number1'},
            "dias_credito" : { type: "number"},
            "dias_vencimiento" : { type: "number"},
            "porcentaje" : { type: "string"},
          }
        )
        items.flujos.forEach((item) => {
          pagos.push(item)
        })
        setDatosReporte(pagos)
      }
    })
    return () => (mounted = false)
  }, [])

  useEffect(() => {
    var pivot = new WebDataRocks({
      container: '#wdr-component',
      beforetoolbarcreated: customizeToolbar,
      height: 480,
      toolbar: true,
      report: {
        dataSource: {
          data: datosReporte,
        },
        slice: {
          rows: [
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
              uniqueName: 'comments',
              caption: 'Detalle',
            },
            {
              uniqueName: 'estado',
              caption: 'Estado',
            },
            {
              uniqueName: 'doc_total',
              caption: 'Monto',
              format: 'number1',
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
            name: "",
            thousandsSeparator: ',',
            decimalSeparator: '.',
            decimalPlaces: 2,
            nullValue: '',
          },
        ],
      },
      global: {
        localization: spanish,
      },
    })
  }, [datosReporte])

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const filtrar = async () => {
    let pagos = []
    getPendientesReporte(session.id, form.year, form.mes, session.api_token).then((items) => {
      pagos.push(
        { 
          "doc_num" : { type: "string"},
          "tipo" : { type: "string"},
          "doc_date" : { type: "date string"},
          "comments" : { type: "string"},
          "estado" : { type: "string"},
          "doc_total" : { type: "number", format: 'number1'},
          "dias_credito" : { type: "number"},
          "dias_vencimiento" : { type: "number"},
          "porcentaje" : { type: "string"},
        }
      )
      items.flujos.forEach((item) => {
        pagos.push(item)
      })
      setDatosReporte(pagos)
    })
  }

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
        <div className="div-search" style={{ marginBottom: '20px' }}>
          <CFormSelect
            name="year"
            style={{ marginLeft: '51%', marginRight: '10px' }}
            onChange={handleInput}
          >
            <option>Seleccione año</option>
            {years.map((item, i) => {
              return (
                <option key={i} value={item}>
                  {item}
                </option>
              )
            })}
          </CFormSelect>
          <CFormSelect name="mes" style={{ marginRight: '10px' }} onChange={handleInput}>
            <option>Seleccione mes</option>
            <option value="1">Enero</option>
            <option value="2">Febrero</option>
            <option value="3">Marzo</option>
            <option value="4">Abril</option>
            <option value="5">Mayo</option>
            <option value="6">Junio</option>
            <option value="7">Julio</option>
            <option value="8">Agosto</option>
            <option value="9">Septiembre</option>
            <option value="10">Octubre</option>
            <option value="11">Noviembre</option>
            <option value="12">Diciembre</option>
          </CFormSelect>
          <Button
            color="primary"
            className="search-button"
            title="Filtrar por año y mes"
            onClick={filtrar}
          >
            <FaSearch />
          </Button>
        </div>
        <div id="wdr-component"></div>
      </>
    )
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default Pendientes
