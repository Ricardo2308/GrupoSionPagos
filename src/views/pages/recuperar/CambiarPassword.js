import React, { useState } from 'react'
import { Alert } from 'react-bootstrap'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import logo from '../../../assets/icons/logo.png'
import { postEditarUsuario } from '../../../services/postEditarUsuario'
import md5 from 'md5'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CContainer,
  CForm,
  CFormControl,
  CInputGroup,
  CInputGroupText,
  CRow,
  CCol,
} from '@coreui/react'
import { FiLock } from 'react-icons/fi'

const CambiarPassword = (props) => {
  const history = useHistory()
  const { usuario } = useParams()
  const [show, setShow] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [color, setColor] = useState('danger')
  const [titulo, setTitulo] = useState('Error!')
  const [form, setValues] = useState({
    usuario: usuario,
    password: '',
    password_repetida: '',
  })

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    if (form.usuario !== '' && form.password !== '' && form.password_repetida !== '') {
      if (form.password === form.password_repetida) {
        if (form.password.length >= 10) {
          event.preventDefault()
          const respuesta = await postEditarUsuario(
            '1',
            '',
            '',
            form.usuario,
            md5(form.password_repetida, { encoding: 'binary' }),
            '',
            '',
            '2',
          )
          if (respuesta === 'OK') {
            history.push('/')
          } else if (respuesta === 'Vacio') {
            setShow(true)
            setTitulo('Error!')
            setMensaje('El nombre o el correo del usuario no está registrado.')
          }
        } else {
          if (form.password.length < 5) {
            setShow(true)
            setTitulo('Contraseña muy débil!')
            setMensaje('La contraseña debe contener al menos 10 caracteres.')
          } else if (form.password.length >= 5 || form.password.length < 10) {
            setShow(true)
            setTitulo('Contraseña débil!')
            setMensaje('La contraseña debe contener al menos 10 caracteres.')
            setColor('warning')
          }
        }
      } else {
        setShow(true)
        setMensaje('Las contraseñas no coinciden.')
      }
    } else {
      setShow(true)
      setMensaje('No has llenado todos los campos.')
    }
  }
  return (
    <>
      <Alert show={show} variant={color} onClose={() => setShow(false)} dismissible>
        <Alert.Heading>{titulo}</Alert.Heading>
        <p>{mensaje}</p>
      </Alert>
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md="11">
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm>
                      <h1 style={{ fontSize: '36px' }}>Cambiar Contraseña</h1>
                      <p className="text-medium-emphasis">Ingrese una nueva contraseña</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <FiLock />
                        </CInputGroupText>
                        <CFormControl
                          type="password"
                          placeholder="Contraseña"
                          name="password"
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
                        Recuperar Contraseña
                      </CButton>
                    </CForm>
                  </CCardBody>
                </CCard>
                <CCard className="text-white py-5" style={{ width: '50%' }}>
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

export default CambiarPassword
