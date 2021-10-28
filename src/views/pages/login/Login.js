import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Alert } from 'react-bootstrap'
import { FiUser, FiLock, FiEye } from 'react-icons/fi'
import { getUsuarios } from '../../../services/getUsuarios'
import { getPoliticas } from '../../../services/getPoliticas'
import { getCantidadDias } from '../../../services/getCantidadDias'
import { postLogPassword } from '../../../services/postLogPassword'
import { postSesionUsuario } from '../../../services/postSesionUsuario'
import { postLogLogin } from '../../../services/postLogLogin'
import { useSession } from 'react-use-session'
import logo from '../../../assets/icons/logo.png'
import md5 from 'md5'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormControl,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'

const Login = () => {
  const history = useHistory()
  const { saveJWT } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [mostrar, setMostrar] = useState(false)
  const [passwordShown, setPasswordShown] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [color, setColor] = useState('')
  const [titulo, setTitulo] = useState('')
  const [politicas, setPoliticas] = useState([])

  useEffect(() => {
    let mounted = true
    getPoliticas(null, null).then((items) => {
      if (mounted) {
        setPoliticas(items.politicas)
      }
    })
    return () => (mounted = false)
  }, [])

  const [form, setValues] = useState({
    usuario: '',
    password: '',
  })

  const showPassword = () => {
    setPasswordShown(passwordShown ? false : true)
  }

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  function obtenerPolitica(politica) {
    let result = ''
    for (let item of politicas) {
      if (item.identificador == politica) {
        result = item.valor
      }
    }
    return result
  }

  async function crearSesion(id) {
    const publicIp = require('public-ip')
    let agente = window.navigator.userAgent
    var navegadores = ['Chrome', 'Firefox', 'Safari', 'Opera', 'Trident', 'MSIE', 'Edge']
    const myip = await publicIp.v4()
    console.log(agente)
    for (var i in navegadores) {
      if (agente.indexOf(navegadores[i]) != -1) {
        const respuesta = await postSesionUsuario(id, navegadores[i], myip, '1')
        if (respuesta === 'OK') {
          return true
        } else {
          return false
        }
      }
    }
  }

  async function revisarPolitica(idUsuario, cambiaPassword) {
    let result = false
    let politica = obtenerPolitica('_LIMITE_CAMBIO_PASSWORD_')
    const respuesta = await getCantidadDias(idUsuario)
    if (respuesta == 'Vacio') {
      const logpassword = await postLogPassword(idUsuario)
      if (logpassword == 'OK') {
        result = true
      }
    } else {
      if (cambiaPassword == 1) {
        if (parseInt(respuesta) >= parseInt(politica)) {
          setMostrar(true)
          setTitulo('Aviso!')
          setColor('info')
          setMensaje(
            'Ya pasaron ' +
              respuesta +
              ' días desde la última vez que cambió su contraseña. Debe actualizarla.',
          )
        } else if (parseInt(respuesta) < parseInt(politica)) {
          result = true
        }
      } else if (cambiaPassword == 0) {
        result = true
      }
    }
    return result
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    getUsuarios(null, null, form.usuario, null).then((items) => {
      if (items.users.length > 0) {
        for (let item of items.users) {
          if (md5(form.password, { encoding: 'binary' }) === item.password) {
            if (item.activo == 1 && item.eliminado == 0) {
              revisarPolitica(item.id, item.cambia_password).then((respuesta) => {
                if (respuesta == true) {
                  crearSesion(item.id).then((sesion) => {
                    if (sesion == true) {
                      let limiteconexion = obtenerPolitica('_LIMITE_TIEMPO_CONEXION_')
                      const sign = require('jwt-encode')
                      const secret = 'secret'
                      const data = {
                        email: item.email,
                        name: item.nombre + ' ' + item.apellido,
                        user_name: item.nombre_usuario,
                        id: item.id,
                        estado: item.activo,
                        limiteconexion: limiteconexion,
                      }
                      const jwt = sign(data, secret)
                      saveJWT(jwt)
                      history.push('/home')
                    }
                  })
                }
              })
            } else {
              setShow(true)
              setTitulo('Error!')
              setColor('danger')
              setMensaje(
                'Parece que tu usuario ha sido bloqueado o eliminado. Consulta con el soporte técnico.',
              )
            }
          } else {
            setShow(true)
            setTitulo('Error!')
            setColor('danger')
            setMensaje('Credenciales incorrectas. Vuelva a intentarlo.')
            if (item.activo == 1) {
              let valor = obtenerPolitica('_LIMITE_ERROR_LOGIN_')
              postLogLogin(item.id, valor)
            }
          }
        }
      } else {
        setShow(true)
        setTitulo('Error!')
        setColor('danger')
        setMensaje('Credenciales incorrectas. Vuelva a intentarlo.')
      }
    })
  }
  return (
    <>
      <Alert show={show} variant={color} onClose={() => setShow(false)} dismissible>
        <Alert.Heading>{titulo}</Alert.Heading>
        <p>{mensaje}</p>
      </Alert>
      <Alert show={mostrar} variant={color} onClose={() => setMostrar(false)} dismissible>
        <Alert.Heading>{titulo}</Alert.Heading>
        <p>{mensaje}</p>
        <hr />
        <div className="d-flex justify-content-end">
          <CButton onClick={() => history.push('/recuperar')} color="primary" variant="outline">
            Actualizar Contraseña
          </CButton>
        </div>
      </Alert>
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md="9">
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm>
                      <h1>Iniciar Sesión</h1>
                      <p className="text-medium-emphasis">Inicie sesión con su correo o usuario</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <FiUser />
                        </CInputGroupText>
                        <CFormControl
                          placeholder="Correo o Usuario"
                          name="usuario"
                          onChange={handleInput}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <FiLock />
                        </CInputGroupText>
                        <CFormControl
                          type={passwordShown ? 'text' : 'password'}
                          name="password"
                          placeholder="Password"
                          onChange={handleInput}
                        />
                        <CButton color="secondary" variant="outline" onClick={showPassword}>
                          <FiEye />
                        </CButton>
                      </CInputGroup>
                      <CRow>
                        <CCol xs="6">
                          <CButton color="primary" className="px-4" onClick={handleSubmit}>
                            Iniciar Sesión
                          </CButton>
                        </CCol>
                        <CCol xs="6" className="text-right">
                          <CButton
                            color="link"
                            className="px-4"
                            onClick={() => history.push('/recuperar')}
                          >
                            Olvidaste contraseña?
                          </CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
                <CCard className="text-blue py-5">
                  <CCardBody className="text-center">
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div style={{ width: '80%', height: '80%', backgroundColor: 'transparent' }}>
                        <img style={{ width: '80%' }} src={logo} />
                      </div>
                    </div>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  )
}

export default Login
