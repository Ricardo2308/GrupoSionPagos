import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCol, CCardHeader, CRow, CFormSelect } from '@coreui/react'
import { CChartBar, CChartDoughnut, CChartPie } from '@coreui/react-chartjs'
import { useIdleTimer } from 'react-idle-timer'
import { Tab, Tabs, Modal, Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { postSesionUsuario } from '../../services/postSesionUsuario'
import { getReportesFlujos } from '../../services/getReportesFlujos'
import { getDatosSemaforoIndividual } from '../../services/getDatosSemaforoIndividual'
import { getDatosSemaforo } from '../../services/getDatosSemaforo'
import { useSession } from 'react-use-session'
import { FaSearch } from 'react-icons/fa'
import '../../scss/estilos.scss'

const Dashboard = () => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [mensaje, setMensaje] = useState('')
  const [results, setList] = useState([])
  const [estados, setEstados] = useState([])
  const [pagos, setPagos] = useState([])
  const [tipos, setTipos] = useState([])
  const [promedioT, setPromedioT] = useState([])
  const [estadosLabel, setEstadosLabel] = useState([])
  const [semaforos, setSemaforos] = useState([])
  const [semaforosNom, setSemaforosNom] = useState([])
  const [semaforosIndividualB, setSemaforosIndividualB] = useState([])
  const [semaforosNomIndividualB, setSemaforosNomIndividualB] = useState([])
  const [semaforosIndividualT, setSemaforosIndividualT] = useState([])
  const [semaforosNomIndividualT, setSemaforosNomIndividualT] = useState([])
  const [semaforosIndividualI, setSemaforosIndividualI] = useState([])
  const [semaforosNomIndividualI, setSemaforosNomIndividualI] = useState([])
  const [PagosTotales, setPagosTotales] = useState(0)
  const [PagosTotalesIndividualB, setPagosTotalesIndividualB] = useState(0)
  const [PagosTotalesIndividualT, setPagosTotalesIndividualT] = useState(0)
  const [PagosTotalesIndividualI, setPagosTotalesIndividualI] = useState(0)
  const [years, setYears] = useState([])
  const [show, setShow] = useState(false)

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
    let estadosLabel = []
    let semaforos = []
    let semaforosNom = []
    let years = []
    for (var i = 0; i < 30; i++) {
      years.push(2021 + i)
    }
    setYears(years)
    getReportesFlujos('1', '0', '0', session.api_token).then((items) => {
      for (const pago of items.flujos) {
        estados.push(parseInt(pago.CantidadEstados))
        labelestados.push(pago.estado)
      }
      setList(estados)
      setEstados(labelestados)
    })
    getReportesFlujos('2', '0', '0', session.api_token).then((items) => {
      for (const pago of items.flujos) {
        pagos.push(parseInt(pago.PagosAprobados))
        labeltipos.push(pago.tipo)
      }
      setPagos(pagos)
      setTipos(labeltipos)
    })
    getReportesFlujos('3', '0', '0', session.api_token).then((items) => {
      for (const pago of items.flujos) {
        promedioT.push(parseInt(pago.promedioPorNivel))
        estadosLabel.push(pago.nombreEstadoOrigen + '->' + pago.nombreEstadoDestino)
      }
      setPromedioT(promedioT)
      setEstadosLabel(estadosLabel)
    })
    getDatosSemaforo(session.id, session.api_token).then((items) => {
      let contador = 0
      for (const pago of items.flujos) {
        semaforos.push(parseInt(pago.cantidad))
        contador = contador + parseInt(pago.cantidad)
        semaforosNom.push(pago.nombreSemaforo)
      }
      setPagosTotales(contador)
      setSemaforos(semaforos)
      setSemaforosNom(semaforosNom)
    })

    let semaforosIndividualB = []
    let semaforosNomIndividualB = []
    getDatosSemaforoIndividual(session.id, 'BANCARIO', session.api_token).then((items) => {
      let contador = 0
      for (const pago of items.flujos) {
        semaforosIndividualB.push(parseInt(pago.cantidad))
        contador = contador + parseInt(pago.cantidad)
        semaforosNomIndividualB.push(pago.nombreSemaforo)
      }
      setPagosTotalesIndividualB(contador)
      setSemaforosIndividualB(semaforosIndividualB)
      setSemaforosNomIndividualB(semaforosNomIndividualB)
    })

    let semaforosIndividualT = []
    let semaforosNomIndividualT = []
    getDatosSemaforoIndividual(session.id, 'TRANSFERENCIA', session.api_token).then((items) => {
      let contador = 0
      for (const pago of items.flujos) {
        semaforosIndividualT.push(parseInt(pago.cantidad))
        contador = contador + parseInt(pago.cantidad)
        semaforosNomIndividualT.push(pago.nombreSemaforo)
      }
      setPagosTotalesIndividualT(contador)
      setSemaforosIndividualT(semaforosIndividualT)
      setSemaforosNomIndividualT(semaforosNomIndividualT)
    })

    let semaforosIndividualI = []
    let semaforosNomIndividualI = []
    getDatosSemaforoIndividual(session.id, 'INTERNA', session.api_token).then((items) => {
      let contador = 0
      for (const pago of items.flujos) {
        semaforosIndividualI.push(parseInt(pago.cantidad))
        contador = contador + parseInt(pago.cantidad)
        semaforosNomIndividualI.push(pago.nombreSemaforo)
      }
      setPagosTotalesIndividualI(contador)
      setSemaforosIndividualI(semaforosIndividualI)
      setSemaforosNomIndividualI(semaforosNomIndividualI)
    })

    const interval = setInterval(() => {
      let estados = []
      let labelestados = []
      let pagos = []
      let labeltipos = []
      let promedioT = []
      let semaforos = []
      let semaforosNom = []
      getReportesFlujos('1', '0', '0', session.api_token).then((items) => {
        for (const pago of items.flujos) {
          estados.push(parseInt(pago.CantidadEstados))
          labelestados.push(pago.estado)
        }
        setList(estados)
        setEstados(labelestados)
      })
      getReportesFlujos('2', '0', '0', session.api_token).then((items) => {
        for (const pago of items.flujos) {
          pagos.push(parseInt(pago.PagosAprobados))
          labeltipos.push(pago.tipo)
        }
        setPagos(pagos)
        setTipos(labeltipos)
      })
      getReportesFlujos('3', '0', '0', session.api_token).then((items) => {
        for (const pago of items.flujos) {
          promedioT.push(parseInt(pago.promedioPorNivel))
        }
        setPromedioT(promedioT)
      })
      getReportesFlujos('4', '0', '0', session.api_token).then((items) => {
        let contador = 0
        for (const pago of items.flujos) {
          semaforos.push(parseInt(pago.cantidad))
          contador = contador + parseInt(pago.cantidad)
          semaforosNom.push(pago.nombreSemaforo)
        }
        setPagosTotales(contador)
        setSemaforos(semaforos)
        setSemaforosNom(semaforosNom)
      })
      let semaforosIndividualB = []
      let semaforosNomIndividualB = []
      getDatosSemaforoIndividual(session.id, 'BANCARIO', session.api_token).then((items) => {
        let contador = 0
        for (const pago of items.flujos) {
          semaforosIndividualB.push(parseInt(pago.cantidad))
          contador = contador + parseInt(pago.cantidad)
          semaforosNomIndividualB.push(pago.nombreSemaforo)
        }
        setPagosTotalesIndividualB(contador)
        setSemaforosIndividualB(semaforosIndividualB)
        setSemaforosNomIndividualB(semaforosNomIndividualB)
      })
      let semaforosIndividualT = []
      let semaforosNomIndividualT = []
      getDatosSemaforoIndividual(session.id, 'TRANSFERENCIA', session.api_token).then((items) => {
        let contador = 0
        for (const pago of items.flujos) {
          semaforosIndividualT.push(parseInt(pago.cantidad))
          contador = contador + parseInt(pago.cantidad)
          semaforosNomIndividualT.push(pago.nombreSemaforo)
        }
        setPagosTotalesIndividualT(contador)
        setSemaforosIndividualT(semaforosIndividualT)
        setSemaforosNomIndividualT(semaforosNomIndividualT)
      })
      let semaforosIndividualI = []
      let semaforosNomIndividualI = []
      getDatosSemaforoIndividual(session.id, 'INTERNA', session.api_token).then((items) => {
        let contador = 0
        for (const pago of items.flujos) {
          semaforosIndividualI.push(parseInt(pago.cantidad))
          contador = contador + parseInt(pago.cantidad)
          semaforosNomIndividualI.push(pago.nombreSemaforo)
        }
        setPagosTotalesIndividualI(contador)
        setSemaforosIndividualI(semaforosIndividualI)
        setSemaforosNomIndividualI(semaforosNomIndividualI)
      })
    }, 900000)
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
    getReportesFlujos('1', form.year, form.mes, session.api_token).then((items) => {
      for (const pago of items.flujos) {
        estados.push(parseInt(pago.CantidadEstados))
        labelestados.push(pago.estado)
      }
      setList(estados)
      setEstados(labelestados)
    })
    getReportesFlujos('2', form.year, form.mes, session.api_token).then((items) => {
      for (const pago of items.flujos) {
        pagos.push(parseInt(pago.PagosAprobados))
        labeltipos.push(pago.tipo)
      }
      setPagos(pagos)
      setTipos(labeltipos)
    })
    getReportesFlujos('3', form.year, form.mes, session.api_token).then((items) => {
      for (const pago of items.flujos) {
        promedioT.push(parseInt(pago.promedioPorNivel))
      }
      setPromedioT(promedioT)
    })
    getReportesFlujos('4', form.year, form.year, session.api_token).then((items) => {
      let contador = 0
      for (const pago of items.flujos) {
        semaforos.push(parseInt(pago.cantidad))
        contador = contador + parseInt(pago.cantidad)
        semaforosNom.push(pago.nombreSemaforo)
      }
      setPagosTotales(contador)
      setSemaforos(semaforos)
      setSemaforosNom(semaforosNom)
    })
  }

  if (session) {
    return (
      <>
        <CRow>
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
          <CCol xs={6}>
            <CCard className="mb-4">
              <CCardHeader>Semáforo de aprobación vs días de credito</CCardHeader>
              <CCardBody style={{ height: '400px' }}>
                <CChartBar
                  height={195}
                  data={{
                    labels: semaforosNom,
                    datasets: [
                      {
                        backgroundColor: ['#D02F2F', '#AF940B', '#428A49', '#3F4AAE'],
                        data: semaforos,
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      title: {
                        display: true,
                        text: 'Total de pagos: ' + PagosTotales,
                        font: {
                          weight: 'normal',
                        },
                        position: 'bottom',
                      },
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </CCardBody>
            </CCard>
          </CCol>
          <CCol xs={6}>
            <CCard className="mb-4">
              <CCardHeader>Semáforo de aprobación vs días de credito personal</CCardHeader>
              <CCardBody style={{ height: '400px' }}>
                <Tabs defaultActiveKey="bancaria" id="uncontrolled-tab-example" className="mb-3">
                  <Tab eventKey="bancaria" title="Bancaria">
                    <CChartBar
                      data={{
                        labels: semaforosNomIndividualB,
                        datasets: [
                          {
                            backgroundColor: ['#D02F2F', '#AF940B', '#428A49', '#3F4AAE'],
                            data: semaforosIndividualB,
                          },
                        ],
                      }}
                      options={{
                        plugins: {
                          title: {
                            display: true,
                            text: 'Total de pagos: ' + PagosTotalesIndividualB,
                            font: {
                              weight: 'normal',
                            },
                            position: 'bottom',
                          },
                          legend: {
                            display: false,
                          },
                        },
                        onClick: (e, a) => {
                          if (a.length > 0) {
                            let colorFiltro = 'NO'
                            if (a[0].index === 0) {
                              colorFiltro = 'ROJO'
                            }
                            if (a[0].index === 1) {
                              colorFiltro = 'AMARILLO'
                            }
                            if (a[0].index === 2) {
                              colorFiltro = 'VERDE'
                            }
                            if (a[0].index === 3) {
                              colorFiltro = 'AZUL'
                            }
                            history.push({
                              pathname: '/pagos/bancario',
                              colorFiltro,
                            })
                          }
                        },
                      }}
                    />
                  </Tab>
                  <Tab eventKey="transferencia" title="Transferencia">
                    <CChartBar
                      data={{
                        labels: semaforosNomIndividualT,
                        datasets: [
                          {
                            backgroundColor: ['#D02F2F', '#AF940B', '#428A49', '#3F4AAE'],
                            data: semaforosIndividualT,
                          },
                        ],
                      }}
                      options={{
                        plugins: {
                          title: {
                            display: true,
                            text: 'Total de pagos: ' + PagosTotalesIndividualT,
                            font: {
                              weight: 'normal',
                            },
                            position: 'bottom',
                          },
                          legend: {
                            display: false,
                          },
                        },
                        onClick: (e, a) => {
                          if (a.length > 0) {
                            let colorFiltro = 'NO'
                            if (a[0].index === 0) {
                              colorFiltro = 'ROJO'
                            }
                            if (a[0].index === 1) {
                              colorFiltro = 'AMARILLO'
                            }
                            if (a[0].index === 2) {
                              colorFiltro = 'VERDE'
                            }
                            if (a[0].index === 3) {
                              colorFiltro = 'AZUL'
                            }
                            history.push({
                              pathname: '/pagos/transferencia',
                              colorFiltro,
                            })
                          }
                        },
                      }}
                    />
                  </Tab>
                  <Tab eventKey="interna" title="Interna">
                    <CChartBar
                      data={{
                        labels: semaforosNomIndividualI,
                        datasets: [
                          {
                            backgroundColor: ['#D02F2F', '#AF940B', '#428A49', '#3F4AAE'],
                            data: semaforosIndividualI,
                          },
                        ],
                      }}
                      options={{
                        plugins: {
                          title: {
                            display: true,
                            text: 'Total de pagos: ' + PagosTotalesIndividualI,
                            font: {
                              weight: 'normal',
                            },
                            position: 'bottom',
                          },
                          legend: {
                            display: false,
                          },
                        },
                        onClick: (e, a) => {
                          if (a.length > 0) {
                            let colorFiltro = 'NO'
                            if (a[0].index === 0) {
                              colorFiltro = 'ROJO'
                            }
                            if (a[0].index === 1) {
                              colorFiltro = 'AMARILLO'
                            }
                            if (a[0].index === 2) {
                              colorFiltro = 'VERDE'
                            }
                            if (a[0].index === 3) {
                              colorFiltro = 'AZUL'
                            }
                            history.push({
                              pathname: '/pagos/interna',
                              colorFiltro,
                            })
                          }
                        },
                      }}
                    />
                  </Tab>
                </Tabs>
              </CCardBody>
            </CCard>
          </CCol>
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
                          '#AF940B',
                          '#428A49',
                          '#40389D',
                          '#8A5C84',
                          '#553D26',
                          '#CD530F',
                          '#454143',
                          '#0B4B4E',
                          '#7D1843',
                          '#6B9614',
                        ],
                        hoverBackgroundColor: [
                          '#CC5855',
                          '#C7C246',
                          '#56A05A',
                          '#6F72C5',
                          '#8E6BC2',
                          '#825E3D',
                          '#CF7340',
                          '#676768',
                          '#18787D',
                          '#87405E',
                          '#9DCA42',
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
                        backgroundColor: ['#D02F2F', '#AF940B', '#428A49'],
                        hoverBackgroundColor: ['#CC5855', '#C7C246', '#56A05A'],
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
                    labels: estadosLabel,
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
        </CRow>
      </>
    )
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default Dashboard
