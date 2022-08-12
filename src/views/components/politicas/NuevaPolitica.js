import React, { useState } from 'react'
import { useSession } from 'react-use-session'
import { Alert, Modal, Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useIdleTimer } from 'react-idle-timer'
import { FiBook, FiGrid, FiHash } from 'react-icons/fi'
import { postCrudPoliticas } from '../../../services/postCrudPoliticas'
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
    identificador: '',
    valor: '',
  })

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    if (form.descripcion !== '' && form.identificador !== '' && form.valor !== '') {
      event.preventDefault()
      const respuesta = await postCrudPoliticas(
        '',
        form.descripcion,
        form.identificador,
        form.valor,
        '',
        '',
        session.id,
        session.api_token,
      )
      if (respuesta === 'OK') {
        history.push('/politicas')
      }
    } else {
      setShow(true)
      setTitulo('Error!')
      setColor('danger')
      setMensaje('No has llenado todos los campos.')
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
                <h1>Creación de Políticas</h1>
                <p className="text-medium-emphasis">Cree una nuevo política</p>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiBook />
                  </CInputGroupText>
                  <textarea
                    placeholder="Descripción"
                    name="descripcion"
                    className="form-control"
                    rows="2"
                    onChange={handleInput}
                  ></textarea>
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiGrid />
                  </CInputGroupText>
                  <CFormSelect
                    placeholder="Identificador"
                    name="identificador"
                    onChange={handleInput}
                  >
                    <option value="_SEMAFORO_VERDE">_SEMAFORO_VERDE</option>
                    <option value="_SEMAFORO_AMARILLO">_SEMAFORO_AMARILLO</option>
                    <option value="_LIMITE_TIEMPO_CONEXION_">_LIMITE_TIEMPO_CONEXION_</option>
                    <option value="_LIMITE_ERROR_LOGIN_">_LIMITE_ERROR_LOGIN_</option>
                    <option value="_LIMITE_CAMBIO_PASSWORD_">_LIMITE_CAMBIO_PASSWORD_</option>
                    <option value="_CORREO">_CORREO</option>
                    <option value="_CORREO_LOTES_PAGO_">_CORREO_LOTES_PAGO_</option>
                    <option value="_DIAS_BASE_CREDITO_">_DIAS_BASE_CREDITO_</option>
                    <option value="_CORREO_RECIBO_TRANSFER_">_CORREO_RECIBO_TRANSFER_</option>
                  </CFormSelect>
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiHash />
                  </CInputGroupText>
                  <CFormControl
                    type="text"
                    placeholder="Valor"
                    name="valor"
                    onChange={handleInput}
                  />
                </CInputGroup>
                <CButton color="primary" onClick={handleSubmit}>
                  Crear Política
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
