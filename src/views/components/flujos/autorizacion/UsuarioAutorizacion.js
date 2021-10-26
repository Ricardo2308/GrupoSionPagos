import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router'
import { useIdleTimer } from 'react-idle-timer'
import { Alert, Modal } from 'react-bootstrap'
import DatePicker, { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
import 'react-datepicker/dist/react-datepicker.css'
import { useSession } from 'react-use-session'
import { postUsuarioAutorizacion } from '../../../../services/postUsuarioAutorizacion'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { getUsuarios } from '../../../../services/getUsuarios'
import '../../../../scss/estilos.scss'
import {
  CButton,
  CCard,
  CCardBody,
  CContainer,
  CForm,
  CFormSelect,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'

const UsuarioGrupo = () => {
  const history = useHistory()
  const location = useLocation()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [showM, setShowM] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [color, setColor] = useState('danger')
  const [titulo, setTitulo] = useState('Error!')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])
  registerLocale('es', es)

  const [form, setValues] = useState({
    aprobador: location.id,
    temporal: '',
  })

  const [fechainicio, setFechaInicio] = useState(new Date())
  const [fechafinal, setFechaFinal] = useState(new Date())

  useEffect(() => {
    let mounted = true
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getUsuarios(null, null, null, null).then((items) => {
      if (mounted) {
        setList(items.users)
      }
    })
    getPerfilUsuario(idUsuario, '2').then((items) => {
      if (mounted) {
        setPermisos(items.detalle)
      }
    })
    return () => (mounted = false)
  }, [])

  function ExistePermiso(objeto) {
    let result = 0
    for (let item of permisos) {
      if (objeto === item.objeto) {
        result = 1
      }
    }
    return result
  }

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    if (form.aprobador !== '' && form.temporal !== '' && fechainicio && fechafinal) {
      if (fechafinal > fechainicio) {
        event.preventDefault()
        const respuesta = await postUsuarioAutorizacion(
          '',
          form.aprobador,
          form.temporal,
          fechainicio,
          fechafinal,
          '',
          '',
        )
        if (respuesta === 'OK') {
          history.push('/autorizacion')
        } else if (respuesta === 'Existe') {
          setShow(true)
          setTitulo('Fechas existentes!')
          setColor('danger')
          setMensaje(
            'Las fechas inicial o final coinciden con una autorizacion ya programada.' +
              ' Intente con otras fechas.',
          )
        }
      } else {
        setShow(true)
        setTitulo('Error!')
        setColor('danger')
        setMensaje('La fecha final debe ser después de la inicial.')
      }
    } else {
      setShow(true)
      setTitulo('Error!')
      setColor('danger')
      setMensaje('No has llenado todos los campos.')
    }
  }

  function iniciar(minutos) {
    let segundos = 60 * minutos
    const intervalo = setInterval(() => {
      segundos--
      if (segundos == 0) {
        Cancelar(2)
      }
    }, 1000)
    setTime(intervalo)
  }

  function detener() {
    clearInterval(time)
  }

  const handleOnIdle = (event) => {
    setShowM(true)
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

  async function Cancelar(opcion) {
    if (opcion == 1) {
      setShowM(false)
      detener()
    } else if (opcion == 2) {
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
  }

  if (session) {
    let deshabilitar = false
    if (ExistePermiso('Modulo Autorizacion') == 0) {
      deshabilitar = true
    }
    return (
      <div style={{ flexDirection: 'row' }}>
        <CContainer>
          <Modal responsive variant="primary" show={showM} onHide={() => Cancelar(2)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Confirmación</Modal.Title>
            </Modal.Header>
            <Modal.Body>{mensaje}</Modal.Body>
            <Modal.Footer>
              <CButton color="secondary" onClick={() => Cancelar(2)}>
                Cancelar
              </CButton>
              <CButton color="primary" onClick={() => Cancelar(1)}>
                Aceptar
              </CButton>
            </Modal.Footer>
          </Modal>
          <Alert show={show} variant={color} onClose={() => setShow(false)} dismissible>
            <Alert.Heading>{titulo}</Alert.Heading>
            <p>{mensaje}</p>
          </Alert>
          <CCard className="autorizacion-card">
            <CCardBody style={{ width: '80%' }}>
              <CForm className="autorizacion-form">
                <h1>Asignación de Usuario Temporal</h1>
                <p className="text-medium-emphasis autorizacion-form">
                  Seleccione a un nuevo encargado
                </p>
                <CInputGroup className="mb-3 autorizacion-form">
                  <CInputGroupText style={{ width: '22%' }}>Usuario Aprobador</CInputGroupText>
                  <CFormSelect name="aprobador" onChange={handleInput} disabled={deshabilitar}>
                    <option selected={true} value={session.id}>
                      {session.name}
                    </option>
                    {results.map((item, i) => {
                      if (item.eliminado == 0 && item.activo == 1) {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.nombre} {item.apellido}
                          </option>
                        )
                      }
                    })}
                  </CFormSelect>
                </CInputGroup>
                <CInputGroup className="mb-3 autorizacion-form">
                  <CInputGroupText style={{ width: '22%' }}>Usuario Temporal</CInputGroupText>
                  <CFormSelect name="temporal" onChange={handleInput}>
                    <option>Seleccione usuario temporal.</option>
                    {results.map((item, i) => {
                      if (item.eliminado == 0 && item.activo == 1 && item.id !== session.id) {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.nombre} {item.apellido}
                          </option>
                        )
                      }
                    })}
                  </CFormSelect>
                </CInputGroup>
                <div style={{ width: '100%', alignItems: 'center' }}>
                  <div className="autorizacion-fecha">
                    <div style={{ width: '100%', alignItems: 'center' }}>
                      <CFormLabel style={{ marginLeft: '40px', marginRight: '15px' }}>
                        Fecha de Inicio
                      </CFormLabel>
                      <DatePicker
                        locale="es"
                        selected={fechainicio}
                        onChange={(date) => setFechaInicio(date)}
                        dateFormat="dd-MMMM-yyyy"
                      />
                    </div>
                    <div style={{ width: '50%', alignItems: 'center' }}>
                      <CFormLabel style={{ marginLeft: '40px', marginRight: '15px' }}>
                        Fecha de Fin
                      </CFormLabel>
                      <DatePicker
                        locale="es"
                        selected={fechafinal}
                        onChange={(date) => setFechaFinal(date)}
                        dateFormat="dd-MMMM-yyyy"
                      />
                    </div>
                  </div>
                </div>
                <br />
                <CButton color="primary" onClick={handleSubmit} style={{ marginBottom: '20px' }}>
                  Guardar Cambios
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CContainer>
      </div>
    )
  } else {
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default UsuarioGrupo
