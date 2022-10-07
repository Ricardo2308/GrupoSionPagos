import React, { useState } from 'react'
import { useSession } from 'react-use-session'
import { Alert, Modal, Button } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { useHistory, useLocation } from 'react-router-dom'
import { postCrudRoles } from '../../../../services/postCrudRoles'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { FiUserPlus, FiSettings, FiLayout } from 'react-icons/fi'
import '../../../../scss/estilos.scss'
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

const EditorRol = () => {
  const history = useHistory()
  const location = useLocation()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [showM, setShowM] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const [form, setValues] = useState({
    descripcion: location.descripcion,
    objeto: location.objeto,
    estado: location.estado,
  })

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    if (form.descripcion !== '' && form.objeto !== '' && form.estado !== '') {
      event.preventDefault()
      const respuesta = await postCrudRoles(
        location.id_rol,
        form.descripcion,
        form.objeto,
        form.estado,
        '1',
        session.id,
        session.api_token,
      )
      if (respuesta === 'OK') {
        history.push('/roles')
      }
    } else {
      setShow(true)
      setMensaje('No has llenado todos los campos')
    }
  }

  if (session) {
    if (location.id_rol) {
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
                  <h1>Modificación de Rol</h1>
                  <p className="text-medium-emphasis">Modifique la información del rol</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FiUserPlus />
                    </CInputGroupText>
                    <textarea
                      placeholder="Descripción"
                      name="descripcion"
                      className="form-control"
                      rows="2"
                      onChange={handleInput}
                      defaultValue={location.descripcion}
                    ></textarea>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FiLayout />
                    </CInputGroupText>
                    <CFormControl
                      type="text"
                      placeholder="Objeto"
                      name="objeto"
                      onChange={handleInput}
                      disabled={true}
                      value={location.objeto}
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
      history.push('/roles')
      return (
        <div className="sin-sesion">
          NO SE CARGÓ EL CÓDIGO DEL ROL. REGRESE A LA PANTALLA DE ROLES.
        </div>
      )
    }
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default EditorRol
