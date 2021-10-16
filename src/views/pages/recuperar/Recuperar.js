import React, { useState } from 'react'
import { Alert } from 'react-bootstrap'
import logo from '../../../assets/icons/logo.png'
import { postRecuperarPassword } from '../../../services/postRecuperarPassword'
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
import { FiAtSign } from 'react-icons/fi'

const Recuperar = () => {
  const [show, setShow] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [titulo, setTitulo] = useState('')
  const [form, setValues] = useState({
    usuario: '',
  })

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const Recuperar = async (event) => {
    if (form.usuario !== '') {
      event.preventDefault()
      const respuesta = await postRecuperarPassword(form.usuario)
      if (respuesta === 'Vacio') {
        setShow(true)
        setTitulo('Usuario inexistente!')
        setMensaje('El usuario ' + form.usuario + ' no existe en el sistema.')
      } else {
        window.location.href = respuesta
      }
    } else {
      setShow(true)
      setTitulo('Error!')
      setMensaje('No has llenado todos los campos.')
    }
  }
  return (
    <>
      <Alert show={show} variant="danger" onClose={() => setShow(false)} dismissible>
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
                      <h1 style={{ fontSize: '36px' }}>Recuperar Contraseña</h1>
                      <p className="text-medium-emphasis">
                        Ingrese su usuario o correo electrónico
                      </p>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <FiAtSign />
                        </CInputGroupText>
                        <CFormControl
                          type="text"
                          placeholder="Correo o Usuario"
                          name="usuario"
                          onChange={handleInput}
                        />
                      </CInputGroup>
                      <CButton color="primary" onClick={Recuperar}>
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

export default Recuperar
