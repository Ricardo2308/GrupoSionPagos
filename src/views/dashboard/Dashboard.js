import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCol, CCardHeader, CRow, CFormSelect } from '@coreui/react'
import { CChartBar, CChartDoughnut, CChartPie } from '@coreui/react-chartjs'
import { useIdleTimer } from 'react-idle-timer'
import { Button, Modal } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { postSesionUsuario } from '../../services/postSesionUsuario'
import { getReportesFlujos } from '../../services/getReportesFlujos'
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
  const [semaforos, setSemaforos] = useState([])
  const [semaforosNom, setSemaforosNom] = useState([])
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
    let semaforos = []
    let semaforosNom = []
    let years = []
    for (var i = 0; i < 30; i++) {
      years.push(2021 + i)
    }
    setYears(years)
    getReportesFlujos('1', '0', '0').then((items) => {
      for (const pago of items.flujos) {
        estados.push(parseInt(pago.CantidadEstados))
        labelestados.push(pago.estado)
      }
      setList(estados)
      setEstados(labelestados)
    })
    getReportesFlujos('2', '0', '0').then((items) => {
      for (const pago of items.flujos) {
        pagos.push(parseInt(pago.PagosAprobados))
        labeltipos.push(pago.tipo)
      }
      setPagos(pagos)
      setTipos(labeltipos)
    })
    getReportesFlujos('3', '0', '0').then((items) => {
      for (const pago of items.flujos) {
        promedioT.push(parseInt(pago.promedioPorNivel))
      }
      setPromedioT(promedioT)
    })
    getReportesFlujos('4', '0', '0').then((items) => {
      for (const pago of items.flujos) {
        semaforos.push(parseInt(pago.cantidad))
        semaforosNom.push(pago.nombreSemaforo)
      }
      setSemaforos(semaforos)
      setSemaforosNom(semaforosNom)
    })
    const interval = setInterval(() => {
      let estados = []
      let labelestados = []
      let pagos = []
      let labeltipos = []
      let promedioT = []
      let semaforos = []
      let semaforosNom = []
      getReportesFlujos('1', '0', '0').then((items) => {
        for (const pago of items.flujos) {
          estados.push(parseInt(pago.CantidadEstados))
          labelestados.push(pago.estado)
        }
        setList(estados)
        setEstados(labelestados)
      })
      getReportesFlujos('2', '0', '0').then((items) => {
        for (const pago of items.flujos) {
          pagos.push(parseInt(pago.PagosAprobados))
          labeltipos.push(pago.tipo)
        }
        setPagos(pagos)
        setTipos(labeltipos)
      })
      getReportesFlujos('3', '0', '0').then((items) => {
        for (const pago of items.flujos) {
          promedioT.push(parseInt(pago.promedioPorNivel))
        }
        setPromedioT(promedioT)
      })
      getReportesFlujos('4', '0', '0').then((items) => {
        for (const pago of items.flujos) {
          semaforos.push(parseInt(pago.cantidad))
          semaforosNom.push(pago.nombreSemaforo)
        }
        setSemaforos(semaforos)
        setSemaforosNom(semaforosNom)
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

  const handleClose = () => setShow(false)

  const filtrar = async () => {
    let estados = []
    let labelestados = []
    let pagos = []
    let labeltipos = []
    let promedioT = []
    let semaforos = []
    let semaforosNom = []
    getReportesFlujos('1', form.year, form.mes).then((items) => {
      for (const pago of items.flujos) {
        estados.push(parseInt(pago.CantidadEstados))
        labelestados.push(pago.estado)
      }
      setList(estados)
      setEstados(labelestados)
    })
    getReportesFlujos('2', form.year, form.mes).then((items) => {
      for (const pago of items.flujos) {
        pagos.push(parseInt(pago.PagosAprobados))
        labeltipos.push(pago.tipo)
      }
      setPagos(pagos)
      setTipos(labeltipos)
    })
    getReportesFlujos('3', form.year, form.mes).then((items) => {
      for (const pago of items.flujos) {
        promedioT.push(parseInt(pago.promedioPorNivel))
      }
      setPromedioT(promedioT)
    })
    getReportesFlujos('4', form.year, form.year).then((items) => {
      for (const pago of items.flujos) {
        semaforos.push(parseInt(pago.cantidad))
        semaforosNom.push(pago.nombreSemaforo)
      }
      setSemaforos(semaforos)
      setSemaforosNom(semaforosNom)
    })
  }

  function iniciar(minutos) {
    let segundos = 60 * minutos
    const intervalo = setInterval(() => {
      segundos--
      if (segundos == 0) {
        Salir()
      }
    }, 1000)
    setTime(intervalo)
  }

  function detener() {
    clearInterval(time)
  }

  const handleOnIdle = (event) => {
    setShow(true)
    setMensaje(
      'Ya estuvo mucho tiempo sin realizar ninguna acción. Se cerrará sesión en unos minutos.' +
        ' Si desea continuar presione Aceptar',
    )
    iniciar(2)
    console.log('last active', getLastActiveTime())
  }

  const handleOnActive = (event) => {
    console.log('time remaining', getRemainingTime())
  }

  const handleOnAction = (event) => {}

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * parseInt(session == null ? 1 : session.limiteconexion),
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500,
  })

  async function Salir() {
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    const respuesta = await postSesionUsuario(idUsuario, null, null, '2')
    if (respuesta === 'OK') {
      clear()
      history.push('/')
    }
    detener()
  }

  if (session) {
    return (
      <>
        <Modal responsive variant="primary" show={show} onHide={() => Salir()} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación</Modal.Title>
          </Modal.Header>
          <Modal.Body>{mensaje}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => Salir()}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
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
        </CRow>
      </>
    )
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default Dashboard
