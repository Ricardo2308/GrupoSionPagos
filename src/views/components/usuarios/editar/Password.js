import React, { useState } from 'react'
import { useSession } from 'react-use-session'
import { Alert, Modal } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { useHistory, useLocation } from 'react-router-dom'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { FiUser, FiSettings, FiAtSign, FiLock } from 'react-icons/fi'
import { getUsuarios } from '../../../../services/getUsuarios'
import { postCambiarPassword } from '../../../../services/postCambiarPassword'
import md5 from 'md5'
import '../../../../scss/estilos.scss'
import {
  CButton,
  CCard,
  CCardBody,
  CContainer,
  CForm,
  CFormControl,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
  CFormCheck,
} from '@coreui/react'

const EditarPassword = (props) => {
  const history = useHistory()
  const location = useLocation()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [showM, setShowM] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [color, setColor] = useState('danger')
  const [titulo, setTitulo] = useState('Error!')
  const { saveJWT } = useSession('PendrogonIT-Session')

  const [form, setValues] = useState({
    password_actual: '',
    password_nueva: '',
    password_repetida: '',
  })

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  async function crearSesion(id) {
    const publicIp = require('public-ip')
    let agente = window.navigator.userAgent
    var navegadores = ['Chrome', 'Firefox', 'Safari', 'Opera', 'Trident', 'MSIE', 'Edge']
    const myip = await publicIp.v4()
    for (var i in navegadores) {
      if (agente.indexOf(navegadores[i]) != -1) {
        const respuesta = await postSesionUsuario(id, navegadores[i], myip, '1', session.api_token)
        if (respuesta === 'OK') {
          return true
        } else {
          return false
        }
      }
    }
  }

  const handleSubmit = async (event) => {
    let result = 0
    if (
      form.password_actual !== '' &&
      form.password_nueva !== '' &&
      form.password_repetida !== ''
    ) {
      event.preventDefault()
      const respuesta = await getUsuarios(
        null,
        null,
        session.user_name,
        null,
        session.api_token,
      ).then((items) => {
        if (items) {
          if (items.users.length > 0) {
            for (let item of items.users) {
              if (md5(form.password_actual, { encoding: 'binary' }) === item.password) {
                if (form.password_nueva === form.password_repetida) {
                  if (form.password_nueva.length >= 10) {
                    return 'ok'
                  } else {
                    if (form.password_nueva.length < 5) {
                      setShow(true)
                      setTitulo('Contraseña muy débil!')
                      setMensaje('La contraseña debe contener al menos 10 caracteres.')
                      setColor('danger')
                      return 'no'
                    } else if (form.password_nueva.length >= 5 || form.password_nueva.length < 10) {
                      setShow(true)
                      setTitulo('Contraseña débil!')
                      setMensaje('La contraseña debe contener al menos 10 caracteres.')
                      setColor('warning')
                      return 'no'
                    }
                  }
                } else {
                  setShow(true)
                  setTitulo('Error!')
                  setMensaje('Las contraseñas no coinciden.')
                  setColor('danger')
                  return 'no'
                }
              } else {
                setShow(true)
                setTitulo('Error!')
                setMensaje('La contraseña actual no es correcta.')
                setColor('danger')
                return 'no'
              }
            }
          }
        }
      })
      if (respuesta === 'ok') {
        const respuestaCambio = await postCambiarPassword(
          'CambioInterno|' + session.id.toString(),
          md5(form.password_repetida, { encoding: 'binary' }),
        )
        if (respuestaCambio === 'ok') {
          if (session.cantidadIngresos == '0') {
            const sign = require('jwt-encode')
            const secret = 'secret'
            const data = {
              email: session.email,
              name: session.name,
              user_name: session.user_name,
              id: session.id,
              estado: session.estado,
              limiteconexion: session.limiteconexion,
              verde: session.verde,
              amarillo: session.amarillo,
              cantidadIngresos: '1',
            }
            clear()
            const jwt = sign(data, secret)
            saveJWT(jwt)
            crearSesion(session.id)
            history.push('/home')
          } else {
            setShow(true)
            setTitulo('Exito!')
            setMensaje('La contraseña fue modificada.')
            setColor('success')
            setTimeout(() => {
              history.push('/home')
            }, 1500)
          }
        } else {
          setShow(true)
          setTitulo('Error!')
          setMensaje('No se logró realizar el cambio.')
          setColor('danger')
        }
      }
    } else {
      setShow(true)
      setTitulo('Error!')
      setMensaje('No has llenado todos los campos.')
      setColor('danger')
    }
  }

  async function Cancelar(opcion) {
    if (opcion == 1) {
      setShowM(false)
    } else if (opcion == 2) {
      let idUsuario = 0
      if (session) {
        idUsuario = session.id
      }
      const respuesta = await postSesionUsuario(idUsuario, null, null, '2', session.api_token)
      if (respuesta === 'OK') {
        clear()
        history.push('/')
      }
    }
  }

  if (session) {
    let selected = false
    if (location.cambia_password == 1) {
      selected = true
    }
    let mostrarMensaje = false
    if (session.cantidadIngresos == '0') {
      mostrarMensaje = true
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
          <CCard style={{ display: 'flex', alignItems: 'center' }}>
            <CCardBody style={{ width: '80%' }}>
              <CForm>
                <div
                  className={!mostrarMensaje ? 'd-none ' : ''}
                  style={{ marginTop: '15px', marginRight: '15px' }}
                >
                  <h5>
                    Ha ingresado por primera vez a la aplicación, por favor cambie su contraseña
                    para continuar.
                  </h5>
                </div>
                <p className="text-medium-emphasis">Ingrese contraseña actual</p>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiLock />
                  </CInputGroupText>
                  <CFormControl
                    type="password"
                    placeholder="Contraseña actual"
                    name="password_actual"
                    onChange={handleInput}
                  />
                </CInputGroup>
                <p className="text-medium-emphasis">Ingrese una nueva contraseña</p>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiLock />
                  </CInputGroupText>
                  <CFormControl
                    type="password"
                    placeholder="Nueva Contraseña"
                    name="password_nueva"
                    onChange={handleInput}
                  />
                </CInputGroup>
                <CInputGroup className="mb-4">
                  <CInputGroupText>
                    <FiLock />
                  </CInputGroupText>
                  <CFormControl
                    name="password_repetida"
                    type="password"
                    placeholder="Repetir Contraseña"
                    onChange={handleInput}
                  />
                </CInputGroup>
                <CButton color="primary" onClick={handleSubmit}>
                  Cambiar
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CContainer>
      </div>
    )
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default EditarPassword
