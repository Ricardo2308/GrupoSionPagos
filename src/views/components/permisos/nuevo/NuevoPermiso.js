import React, { useState } from 'react'
import { useSession } from 'react-use-session'
import { Alert, Modal, Button } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { useHistory } from 'react-router-dom'
import { FiUserCheck } from 'react-icons/fi'
import { postCrudPermiso } from '../../../../services/postCrudPermiso'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import '../../../../scss/estilos.scss'
import {
  CButton,
  CCard,
  CCardBody,
  CContainer,
  CForm,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import { FaArrowLeft } from 'react-icons/fa'

const NuevoPermiso = () => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [showM, setShowM] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [color, setColor] = useState('danger')
  const [titulo, setTitulo] = useState('Error!')

  const [form, setValues] = useState({
    descripcion: '',
  })

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    if (form.descripcion !== '') {
      event.preventDefault()
      const respuesta = await postCrudPermiso(
        '',
        form.descripcion,
        '',
        '',
        session.id,
        session.api_token,
      )
      if (respuesta === 'OK') {
        history.push('/permisos')
      }
    } else {
      setShow(true)
      setTitulo('Error!')
      setColor('danger')
      setMensaje('No has ingresado ninguna descripción.')
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
                <h1>Creación de Permiso</h1>
                <p className="text-medium-emphasis">Cree un nuevo permiso</p>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiUserCheck />
                  </CInputGroupText>
                  <textarea
                    placeholder="Descripción"
                    className="form-control"
                    rows="2"
                    onChange={handleInput}
                    name="descripcion"
                  ></textarea>
                </CInputGroup>
                <CButton color="primary" onClick={handleSubmit}>
                  Crear Permiso
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

export default NuevoPermiso
