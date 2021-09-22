import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCol, CCardHeader, CRow } from '@coreui/react'
import { getFlujos } from '../../services/getFlujos'
import { DocsLink } from 'src/reusable'
import { useSession } from 'react-use-session'
import '../../scss/estilos.scss'
import {
  CChartBar,
  CChartDoughnut,
  CChartLine,
  CChartPie,
  CChartPolarArea,
  CChartRadar,
} from '@coreui/react-chartjs'

const Dashboard = () => {
  const { session } = useSession('PendrogonIT-Session')
  const random = () => Math.round(Math.random() * 100)
  const [results, setList] = useState([])
  const [estados, setEstados] = useState([])
  const [pagos, setPagos] = useState([])
  const [tipos, setTipos] = useState([])

  useEffect(() => {
    let estados = []
    let labelestados = []
    let pagos = []
    let labeltipos = []
    getFlujos('0', null, null, '1').then((items) => {
      for (const pago of items.flujos) {
        estados.push(parseInt(pago.CantidadEstados))
        labelestados.push(pago.estado)
      }
      setList(estados)
      setEstados(labelestados)
    })
    getFlujos('0', null, null, '2').then((items) => {
      for (const pago of items.flujos) {
        pagos.push(parseInt(pago.PagosAprobados))
        labeltipos.push(pago.tipo)
      }
      setPagos(pagos)
      setTipos(labeltipos)
    })
    const interval = setInterval(() => {
      let estados = []
      let labelestados = []
      let pagos = []
      let labeltipos = []
      getFlujos('0', null, null, '1').then((items) => {
        for (const pago of items.flujos) {
          estados.push(parseInt(pago.CantidadEstados))
          labelestados.push(pago.estado)
        }
        setList(estados)
        setEstados(labelestados)
      })
      getFlujos('0', null, null, '2').then((items) => {
        for (const pago of items.flujos) {
          pagos.push(parseInt(pago.PagosAprobados))
          labeltipos.push(pago.tipo)
        }
        setPagos(pagos)
        setTipos(labeltipos)
      })
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  if (session) {
    return (
      <CRow>
        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardHeader>Cantidad de Pagos por Estado</CCardHeader>
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
        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardHeader>Cantidad de Pagos Aprobados por Tipo</CCardHeader>
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
        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardHeader>
              Bar Chart
              <DocsLink href="http://www.chartjs.org" />
            </CCardHeader>
            <CCardBody>
              <CChartBar
                data={{
                  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                  datasets: [
                    {
                      label: 'GitHub Commits',
                      backgroundColor: '#f87979',
                      data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
                    },
                  ],
                }}
                labels="months"
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardHeader>Line Chart</CCardHeader>
            <CCardBody>
              <CChartLine
                data={{
                  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                  datasets: [
                    {
                      label: 'My First dataset',
                      backgroundColor: 'rgba(220, 220, 220, 0.2)',
                      borderColor: 'rgba(220, 220, 220, 1)',
                      pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                      pointBorderColor: '#fff',
                      data: [random(), random(), random(), random(), random(), random(), random()],
                    },
                    {
                      label: 'My Second dataset',
                      backgroundColor: 'rgba(151, 187, 205, 0.2)',
                      borderColor: 'rgba(151, 187, 205, 1)',
                      pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                      pointBorderColor: '#fff',
                      data: [random(), random(), random(), random(), random(), random(), random()],
                    },
                  ],
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardHeader>Polar Area Chart</CCardHeader>
            <CCardBody>
              <CChartPolarArea
                data={{
                  labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue'],
                  datasets: [
                    {
                      data: [11, 16, 7, 3, 14],
                      backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
                    },
                  ],
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardHeader>Radar Chart</CCardHeader>
            <CCardBody>
              <CChartRadar
                data={{
                  labels: [
                    'Eating',
                    'Drinking',
                    'Sleeping',
                    'Designing',
                    'Coding',
                    'Cycling',
                    'Running',
                  ],
                  datasets: [
                    {
                      label: 'My First dataset',
                      backgroundColor: 'rgba(220, 220, 220, 0.2)',
                      borderColor: 'rgba(220, 220, 220, 1)',
                      pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                      pointBorderColor: '#fff',
                      pointHighlightFill: '#fff',
                      pointHighlightStroke: 'rgba(220, 220, 220, 1)',
                      data: [65, 59, 90, 81, 56, 55, 40],
                    },
                    {
                      label: 'My Second dataset',
                      backgroundColor: 'rgba(151, 187, 205, 0.2)',
                      borderColor: 'rgba(151, 187, 205, 1)',
                      pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                      pointBorderColor: '#fff',
                      pointHighlightFill: '#fff',
                      pointHighlightStroke: 'rgba(151, 187, 205, 1)',
                      data: [28, 48, 40, 19, 96, 27, 100],
                    },
                  ],
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
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
