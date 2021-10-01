import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCol, CCardHeader, CRow, CFormSelect } from '@coreui/react'
import { CChartBar, CChartDoughnut, CChartPie } from '@coreui/react-chartjs'
import { Button } from 'react-bootstrap'
import { getFlujos } from '../../services/getFlujos'
import { useSession } from 'react-use-session'
import { FaSearch } from 'react-icons/fa'
import '../../scss/estilos.scss'

const Dashboard = () => {
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [estados, setEstados] = useState([])
  const [pagos, setPagos] = useState([])
  const [tipos, setTipos] = useState([])
  const [promedioT, setPromedioT] = useState([])
  const [semaforos, setSemaforos] = useState([])
  const [semaforosNom, setSemaforosNom] = useState([])
  const [years, setYears] = useState([])

  const [form, setValues] = useState({
    year: '0',
    mes: '0',
  })

  useEffect(() => {
    let estados = []
    let labelestados = []
    let pagos = []
    let labeltipos = []
    let promedioT = []
    let semaforos = []
    let semaforosNom = []
    let years = []
    for (var i = 0; i < 30; i++) {
      years.push(2021 + i)
    }
    setYears(years)
    getFlujos('0', null, null, '1', '0', '0').then((items) => {
      for (const pago of items.flujos) {
        estados.push(parseInt(pago.CantidadEstados))
        labelestados.push(pago.estado)
      }
      setList(estados)
      setEstados(labelestados)
    })
    getFlujos('0', null, null, '2', '0', '0').then((items) => {
      for (const pago of items.flujos) {
        pagos.push(parseInt(pago.PagosAprobados))
        labeltipos.push(pago.tipo)
      }
      setPagos(pagos)
      setTipos(labeltipos)
    })
    getFlujos('0', null, null, '4', '0', '0').then((items) => {
      for (const pago of items.flujos) {
        promedioT.push(parseInt(pago.promedioPorNivel))
      }
      setPromedioT(promedioT)
    })
    //getFlujos('0', null, null, '5', form.year, form.mes).then((items) => {
    //for (const pago of items.flujos) {
    //semaforos.push(parseInt(pago.cantidad))
    //semaforosNom.push(pago.nombreSemaforo)
    //}
    //setSemaforos(semaforos)
    //setSemaforosNom(semaforosNom)
    //})
    const interval = setInterval(() => {
      let estados = []
      let labelestados = []
      let pagos = []
      let labeltipos = []
      let promedioT = []
      let semaforos = []
      let semaforosNom = []
      getFlujos('0', null, null, '1', '0', '0').then((items) => {
        for (const pago of items.flujos) {
          estados.push(parseInt(pago.CantidadEstados))
          labelestados.push(pago.estado)
        }
        setList(estados)
        setEstados(labelestados)
      })
      getFlujos('0', null, null, '2', '0', '0').then((items) => {
        for (const pago of items.flujos) {
          pagos.push(parseInt(pago.PagosAprobados))
          labeltipos.push(pago.tipo)
        }
        setPagos(pagos)
        setTipos(labeltipos)
      })
      getFlujos('0', null, null, '4', '0', '0').then((items) => {
        for (const pago of items.flujos) {
          promedioT.push(parseInt(pago.promedioPorNivel))
        }
        setPromedioT(promedioT)
      })
      //getFlujos('0', null, null, '5', form.year, form.mes).then((items) => {
      //for (const pago of items.flujos) {
      //semaforos.push(parseInt(pago.cantidad))
      //semaforosNom.push(pago.nombreSemaforo)
      //}
      //setSemaforos(semaforos)
      //setSemaforosNom(semaforosNom)
      //})
    }, 300000)
    return () => clearInterval(interval)
  }, [])

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const filtrar = async () => {
    let estados = []
    let labelestados = []
    let pagos = []
    let labeltipos = []
    let promedioT = []
    let semaforos = []
    let semaforosNom = []
    getFlujos('0', null, null, '1', form.year, form.mes).then((items) => {
      for (const pago of items.flujos) {
        estados.push(parseInt(pago.CantidadEstados))
        labelestados.push(pago.estado)
      }
      setList(estados)
      setEstados(labelestados)
    })
    getFlujos('0', null, null, '2', form.year, form.mes).then((items) => {
      for (const pago of items.flujos) {
        pagos.push(parseInt(pago.PagosAprobados))
        labeltipos.push(pago.tipo)
      }
      setPagos(pagos)
      setTipos(labeltipos)
    })
    getFlujos('0', null, null, '4', form.year, form.mes).then((items) => {
      for (const pago of items.flujos) {
        promedioT.push(parseInt(pago.promedioPorNivel))
      }
      setPromedioT(promedioT)
    })
    //getFlujos('0', null, null, '5', form.year, form.mes).then((items) => {
    //for (const pago of items.flujos) {
    //semaforos.push(parseInt(pago.cantidad))
    //semaforosNom.push(pago.nombreSemaforo)
    //}
    //setSemaforos(semaforos)
    //setSemaforosNom(semaforosNom)
    //})
  }

  if (session) {
    return (
      <CRow>
        <div className="div-search">
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
        <CCol xs={6} style={{ marginTop: '10px' }}>
          <CCard className="mb-4">
            <CCardHeader>Cantidad de pagos por estado</CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={{
                  labels: estados,
                  datasets: [
                    {
                      backgroundColor: [
                        '#D02F2F',
                        '#ADBC3C',
                        '#40389D',
                        '#8A5C84',
                        '#428A49',
                        '#553D26',
                      ],
                      hoverBackgroundColor: [
                        '#CC5855',
                        '#C7C246',
                        '#6F72C5',
                        '#8E6BC2',
                        '#56A05A',
                        '#825E3D',
                      ],
                      data: results,
                    },
                  ],
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={6} style={{ marginTop: '10px' }}>
          <CCard className="mb-4">
            <CCardHeader>Cantidad de pagos aprobados por tipo</CCardHeader>
            <CCardBody>
              <CChartPie
                data={{
                  labels: tipos,
                  datasets: [
                    {
                      data: pagos,
                      backgroundColor: ['#D02F2F', '#40389D', '#428A49'],
                      hoverBackgroundColor: ['#CC5855', '#6F72C5', '#56A05A'],
                    },
                  ],
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>Promedio de tiempo de pagos entre estados (Horas)</CCardHeader>
            <CCardBody>
              <CChartBar
                data={{
                  labels: [
                    'Pago cargado->Archivo cargado',
                    'Archivo cargado->Responsable asignado',
                    'Responsable asignado->Aprobación de nivel',
                    'Aprobación de nivel->Autorización completa',
                  ],
                  datasets: [
                    {
                      label: 'Horas',
                      backgroundColor: '#1D2377',
                      data: promedioT,
                    },
                  ],
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
        {/*
        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardHeader>Semáforo de aprobación vs días de credito</CCardHeader>
            <CCardBody>
              <CChartBar
                data={{
                  labels: semaforosNom,
                  datasets: [
                    {
                      label: 'Pagos',
                      backgroundColor: ['#D02F2F', '#AF940B', '#428A49'],
                      data: semaforos,
                    },
                  ],
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
        */}
      </CRow>
    )
  } else {
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
  {
    /*
  return (
    const random = () => Math.round(Math.random() * 100)
    {/*
    <>
      <div>
        <img src={logo} />
      </div>
      {/*
      <WidgetsDropdown />
      
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm="5">
              <h4 id="traffic" className="card-title mb-0">
                Traffic
              </h4>
              <div className="small text-medium-emphasis">January - July 2021</div>
            </CCol>
            <CCol sm="7" className="d-none d-md-block">
              <CButton color="primary" className="float-end">
                <CIcon name="cil-cloud-download" />
              </CButton>
              <CButtonGroup className="float-end me-3">
                {['Day', 'Month', 'Year'].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={value === 'Month'}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          <CChartLine
            style={{ height: '300px', marginTop: '40px' }}
            data={{
              labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
              datasets: [
                {
                  label: 'My First dataset',
                  backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
                  borderColor: getStyle('--cui-info'),
                  pointHoverBackgroundColor: getStyle('--cui-info'),
                  borderWidth: 2,
                  data: [
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                  ],
                  fill: true,
                },
                {
                  label: 'My Second dataset',
                  backgroundColor: 'transparent',
                  borderColor: getStyle('--cui-success'),
                  pointHoverBackgroundColor: getStyle('--cui-success'),
                  borderWidth: 2,
                  data: [
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                  ],
                },
                {
                  label: 'My Third dataset',
                  backgroundColor: 'transparent',
                  borderColor: getStyle('--cui-danger'),
                  pointHoverBackgroundColor: getStyle('--cui-danger'),
                  borderWidth: 1,
                  borderDash: [8, 5],
                  data: [65, 65, 65, 65, 65, 65, 65],
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  grid: {
                    drawOnChartArea: false,
                  },
                },
                y: {
                  ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 5,
                    stepSize: Math.ceil(250 / 5),
                    max: 250,
                  },
                },
              },
              elements: {
                line: {
                  tension: 0.4,
                },
                point: {
                  radius: 0,
                  hitRadius: 10,
                  hoverRadius: 4,
                  hoverBorderWidth: 3,
                },
              },
            }}
          />
        </CCardBody>
        <CCardFooter>
          <CRow className="text-center">
            <CCol md sm="12" className="mb-sm-2 mb-0">
              <div className="text-medium-emphasis">Visits</div>
              <strong>29.703 Users (40%)</strong>
              <CProgress thin className="mt-2" precision={1} color="success" value={40} />
            </CCol>
            <CCol md sm="12" className="mb-sm-2 mb-0">
              <div className="text-medium-emphasis">Unique</div>
              <strong>24.093 Users (20%)</strong>
              <CProgress thin className="mt-2" precision={1} color="info" value={40} />
            </CCol>
            <CCol md sm="12" className="mb-sm-2 mb-0">
              <div className="text-medium-emphasis">Pageviews</div>
              <strong>78.706 Views (60%)</strong>
              <CProgress thin className="mt-2" precision={1} color="warning" value={40} />
            </CCol>
            <CCol md sm="12" className="mb-sm-2 mb-0">
              <div className="text-medium-emphasis">New Users</div>
              <strong>22.123 Users (80%)</strong>
              <CProgress thin className="mt-2" precision={1} color="danger" value={40} />
            </CCol>
            <CCol md sm="12" className="mb-sm-2 mb-0">
              <div className="text-medium-emphasis">Bounce Rate</div>
              <strong>Average Rate (40.15%)</strong>
              <CProgress thin className="mt-2" precision={1} value={40} />
            </CCol>
          </CRow>
        </CCardFooter>
      </CCard>

      <WidgetsBrand withCharts />      

              <br />

              <CTable hover responsive align="middle" className="mb-0 border">
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">
                      <CIcon name="cil-people" />
                    </CTableHeaderCell>
                    <CTableHeaderCell>User</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Country</CTableHeaderCell>
                    <CTableHeaderCell>Usage</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Payment Method</CTableHeaderCell>
                    <CTableHeaderCell>Activity</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell className="text-center">
                      <CAvatar size="md" src="avatars/1.jpg" status="success" />
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>Yiorgos Avraamu</div>
                      <div className="small text-medium-emphasis">
                        <span>New</span> | Registered: Jan 1, 2015
                      </div>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CIcon size="xl" name="cif-us" title="us" id="us" />
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="clearfix">
                        <div className="float-start">
                          <strong>50%</strong>
                        </div>
                        <div className="float-end">
                          <small className="text-medium-emphasis">
                            Jun 11, 2015 - Jul 10, 2015
                          </small>
                        </div>
                      </div>
                      <CProgress thin color="success" value={50} />
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CIcon size="xl" name="cib-cc-mastercard" />
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="small text-medium-emphasis">Last login</div>
                      <strong>10 sec ago</strong>
                    </CTableDataCell>
                  </CTableRow>                                                                               
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
  */
  }
}

export default Dashboard
