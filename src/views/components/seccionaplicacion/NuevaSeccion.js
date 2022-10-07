import React, { useState } from 'react'
import { useSession } from 'react-use-session'
import { Alert, Modal, Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useIdleTimer } from 'react-idle-timer'
import { FiBook, FiGrid, FiHash } from 'react-icons/fi'
import { postSeccionAplicacion } from '../../../services/postSeccionAplicacion'
import { postSesionUsuario } from '../../../services/postSesionUsuario'
import '../../../scss/estilos.scss'
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
} from '@coreui/react'
import { FaArrowLeft } from 'react-icons/fa'

const NuevaSeccion = () => {
  const history = useHistory()
  const { session, clear } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [showM, setShowM] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [color, setColor] = useState('danger')
  const [titulo, setTitulo] = useState('Error!')

  const [form, setValues] = useState({
    nombre: '',
    direccion: '',
    direccion_movil: '',
  })

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    if (form.nombre !== '' && form.direccion !== '') {
      event.preventDefault()
      const respuesta = await postSeccionAplicacion(
        '',
        form.nombre,
        form.direccion,
        form.direccion_movil,
        '',
        '',
        session.id,
        session.api_token,
      )
      if (respuesta === 'OK') {
        history.push('/seccionaplicacion')
      }
    } else {
      setShow(true)
      setTitulo('Error!')
      setColor('danger')
      setMensaje('No has llenado todos los campos.')
    }
  }

  if (session) {
    return (
      <div style={{ flexDirection: 'row' }}>
        <CContainer>
          <div className="float-left" style={{ marginBottom: '10px' }}>
            <Button variant="primary" size="sm" onClick={() => history.goBack()}>
              <FaArrowLeft />
              &nbsp;&nbsp;Regresar
            </Button>
          </div>
          <br />
          <br />
          <Alert show={show} variant={color} onClose={() => setShow(false)} dismissible>
            <Alert.Heading>{titulo}</Alert.Heading>
            <p>{mensaje}</p>
          </Alert>
          <CCard style={{ display: 'flex', alignItems: 'center' }}>
            <CCardBody style={{ width: '80%' }}>
              <CForm style={{ width: '100%' }}>
                <h1>Creación de secciones</h1>
                <p className="text-medium-emphasis">Cree una nuevo sección</p>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiBook />
                  </CInputGroupText>
                  <CFormControl
                    type="text"
                    placeholder="Nombre"
                    name="nombre"
                    onChange={handleInput}
                  />
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiGrid />
                  </CInputGroupText>
                  <CFormControl
                    type="text"
                    placeholder="Dirección"
                    name="direccion"
                    onChange={handleInput}
                  />
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiGrid />
                  </CInputGroupText>
                  <CFormControl
                    type="text"
                    placeholder="Dirección movil"
                    name="direccion_movil"
                    onChange={handleInput}
                  />
                </CInputGroup>
                <CButton color="primary" onClick={handleSubmit}>
                  Crear
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

export default NuevaSeccion
