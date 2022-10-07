import React, { useState } from 'react'
import { useSession } from 'react-use-session'
import { Alert, Modal, Button } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { useHistory, useLocation } from 'react-router-dom'
import { postSeccionAplicacion } from '../../../services/postSeccionAplicacion'
import { postSesionUsuario } from '../../../services/postSesionUsuario'
import { FiBook, FiSettings, FiGrid, FiHash } from 'react-icons/fi'
import '../../../scss/estilos.scss'
import {
  CButton,
  CCard,
  CCardBody,
  CContainer,
  CForm,
  CInputGroupText,
  CFormControl,
  CInputGroup,
  CFormSelect,
} from '@coreui/react'
import { FaArrowLeft } from 'react-icons/fa'

const EditarSeccionAplicacion = () => {
  const history = useHistory()
  const location = useLocation()
  const { session, clear } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [showM, setShowM] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const [form, setValues] = useState({
    nombre: location.nombre,
    direccion: location.direccion,
    direccion_movil: location.direccion_movil,
    estado: location.estado,
  })

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    if (form.nombre !== '' && form.direccion !== '' && form.estado !== '') {
      event.preventDefault()
      const respuesta = await postSeccionAplicacion(
        location.id_seccionaplicacion,
        form.nombre,
        form.direccion,
        form.direccion_movil,
        '1',
        form.estado,
        session.id,
        session.api_token,
      )
      if (respuesta === 'OK') {
        history.push('/seccionaplicacion')
      }
    } else {
      setShow(true)
      setMensaje('No has llenado todos los campos')
    }
  }

  if (session) {
    if (location.id_seccionaplicacion) {
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
            <Alert show={show} variant="danger" onClose={() => setShow(false)} dismissible>
              <Alert.Heading>Error!</Alert.Heading>
              <p>{mensaje}</p>
            </Alert>
            <CCard style={{ display: 'flex', alignItems: 'center' }}>
              <CCardBody style={{ width: '80%' }}>
                <CForm style={{ width: '100%' }}>
                  <h1>Modificación de Sección</h1>
                  <p className="text-medium-emphasis">Modifique la información de la sección</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FiBook />
                    </CInputGroupText>
                    <CFormControl
                      type="text"
                      placeholder="Nombre"
                      name="nombre"
                      onChange={handleInput}
                      defaultValue={location.nombre}
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
                      defaultValue={location.direccion}
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
                      defaultValue={location.direccion_movil}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FiSettings />
                    </CInputGroupText>
                    <CFormSelect name="estado" onChange={handleInput}>
                      <option>Seleccione estado. (Opcional)</option>
                      <option value="1">Activo</option>
                      <option value="0">Inactivo</option>
                    </CFormSelect>
                  </CInputGroup>
                  <CButton color="primary" onClick={handleSubmit}>
                    Guardar Cambios
                  </CButton>
                </CForm>
              </CCardBody>
            </CCard>
          </CContainer>
        </div>
      )
    } else {
      history.push('/seccionaplicacion')
      return (
        <div className="sin-sesion">
          NO SE CARGÓ EL CÓDIGO DE LA POLÍTICA. REGRESE A LA PANTALLA DE POLÍTICAS.
        </div>
      )
    }
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default EditarSeccionAplicacion
