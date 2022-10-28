/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSession } from 'react-use-session'
import { Button, Alert } from 'react-bootstrap'
import { getReporteCompensados } from '../../../services/getReporteCompensados'
import spanish from '../../../lenguaje/es.json'
import '../../../scss/estilos.scss'
import { CFormSelect } from '@coreui/react'
import { FaSearch } from 'react-icons/fa'

const Compensados = (prop) => {
  const history = useHistory()
  const { session, clear } = useSession('PendrogonIT-Session')
  const [years, setYears] = useState([])
  const [datosReporte, setDatosReporte] = useState([])
  const [inicio, setInicio] = useState('')
  const [final, setFinal] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [titulo, setTitulo] = useState('Error!')
  const [color, setColor] = useState('danger')
  const [mensaje, setMensaje] = useState('')

  const [form, setValues] = useState({
    campo: 'fecha',
  })

  useEffect(() => {
    let mounted = true
    let years = []
    for (var i = 0; i < 30; i++) {
      years.push(2021 + i)
    }
    setYears(years)
    let pagos = []
    getReporteCompensados(session.id, null, null, form.campo, session.api_token).then((items) => {
      if (mounted) {
        pagos.push(
          { 
            "empresa_nombre" : { type: "string" },
            "doc_num" : { type: "string"},
            "tipo" : { type: "string"},
            "dfl_account" : { type: "string"},
            "en_favor_de" : { type: "string"},
            "comments" : { type: "string"},
            "doc_total" : { type: "number"},
            "doc_date" : { type: "date string"},
            "aut_date" : { type: "datetime"},
            "fecha" : { type: "datetime"},
            "nombre_estado" : { type: "string"},
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
              uniqueName: 'dfl_account',
              caption: 'Cuenta',
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
              uniqueName: 'doc_date',
              caption: 'Fecha emisión',
            },
            {
              uniqueName: 'aut_date',
              caption: 'Fecha autorización',
            },
            {
              uniqueName: 'fecha',
              caption: 'Fecha compensación',
            },
            {
              uniqueName: 'nombre_estado',
              caption: 'Estado',
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
    if(final >= inicio){
      let pagos = []
      getReporteCompensados(session.id, inicio, final, form.campo, session.api_token).then((items) => {
        pagos.push(
          { 
            "empresa_nombre" : { type: "string" },
            "doc_num" : { type: "string"},
            "tipo" : { type: "string"},
            "dfl_account" : { type: "string"},
            "en_favor_de" : { type: "string"},
            "comments" : { type: "string"},
            "doc_total" : { type: "number"},
            "doc_date" : { type: "date string"},
            "aut_date" : { type: "datetime"},
            "fecha" : { type: "datetime"},
            "nombre_estado" : { type: "string"},
          }
        )
        items.flujos.forEach((item) => {
          pagos.push(item)
        })
        setDatosReporte(pagos)
      })
    }else{
      setShowAlert(true)
      setTitulo('Error!')
      setColor('danger')
      setMensaje('Las fechas seleccionadas no son validas')
      setTimeout(() => {
        setShowAlert(false)
      }, 4000)
    }
  }

  function customizeToolbar(toolbar) {
    var tabs = toolbar.getTabs()
    toolbar.getTabs = function () {
      delete tabs[0]
      delete tabs[1]
      return tabs
    }
  }

  function registrarInicio(fecha) {
    setInicio(fecha)
  }

  function registrarFinal(fecha) {
    setFinal(fecha)
  }

  if (session) {
    return (
      <>
      <div style={{ display: 'flex', gap: '10px', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'baseline' }}>
          <CFormSelect
            name="campo"
            style={{ marginLeft: '52%', marginRight: '10px' }}
            onChange={handleInput}
            size="sm"
          >
            <option value="fecha">Seleccione fecha para filtro</option>
            <option value="doc_date">Fecha emisión</option>
            <option value="aut_date">Fecha autorización</option>
            <option value="fecha">Fecha compensación</option>
          </CFormSelect>
          De:
          <input
            defaultValue={inicio}
            type="date"
            onChange={(e) => {
              registrarInicio(e.target.value)
            }}
          />
          A:
          <input
            defaultValue={final}
            type="date"
            onChange={(e) => {
              registrarFinal(e.target.value)
            }}
          />{' '}
          <Button color="primary" size="sm" title="Buscar" onClick={filtrar}>
            <FaSearch />
          </Button>
        </div>
        <br />
        <Alert show={showAlert} variant={color} onClose={() => setShowAlert(false)} dismissible>
          <Alert.Heading>{titulo}</Alert.Heading>
          <p>{mensaje}</p>
        </Alert>
        <div id="wdr-component"></div>
      </>
    )
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default Compensados
