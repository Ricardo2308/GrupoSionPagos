import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Alert } from 'react-bootstrap'
import { FiUser, FiLock, FiEye } from 'react-icons/fi'
import { getUsuarios } from '../../../services/getUsuarios'
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

  const [form, setValues] = useState({
    usuario: '',
    password: '',
  })

  const { saveJWT } = useSession('PendrogonIT-Session')
  const [results, setList] = useState()
  const [show, setShow] = useState(false)
  const [passwordShown, setPasswordShown] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const showPassword = () => {
    setPasswordShown(passwordShown ? false : true)
  }

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  useEffect(() => {
    let mounted = true
    getUsuarios(null, null, null, null).then((items) => {
      if (mounted) {
        setList(items.users)
        console.log(items)
      }
    })
    return () => (mounted = false)
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    results.map((item) => {
      if (
        md5(form.password, { encoding: 'binary' }) === item.password &&
        (form.usuario === item.email || form.usuario === item.nombre_usuario)
      ) {
        if (item.activo !== '0' && item.eliminado !== '1') {
          const sign = require('jwt-encode')
          const secret = 'secret'
          const data = {
            email: item.email,
            name: item.nombre + ' ' + item.apellido,
            user_name: item.nombre_usuario,
            id: item.id,
            estado: item.activo,
          }
          const jwt = sign(data, secret)
          saveJWT(jwt)
          history.push('/home')
        } else {
          setMensaje(
            'Parece que tu usuario ha sido bloqueado o inhabilitado. Consulta con el soporte técnico.',
          )
        }
      } else {
        setShow(true)
        setMensaje('Usuario o contraseña incorrectos. Vuelva a intentarlo.')
      }
    })
  }
  return (
    <>
      <Alert show={show} variant="danger" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>Error!</Alert.Heading>
        <p>{mensaje}</p>
      </Alert>
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md="9">
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm onSubmit={handleSubmit}>
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
                          <CButton color="primary" className="px-4" type="submit">
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
