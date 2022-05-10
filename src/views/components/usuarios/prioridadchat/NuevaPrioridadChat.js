import React, { useState, useEffect } from 'react'
import { useSession } from 'react-use-session'
import { Alert, Modal, Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useIdleTimer } from 'react-idle-timer'
import { FiUserCheck, FiUserPlus } from 'react-icons/fi'
import { postUsuarioPrioridadMensajes } from '../../../../services/postUsuarioPrioridadMensajes'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
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
} from '@coreui/react'
import { FaArrowLeft } from 'react-icons/fa'
import { getUsuarios } from '../../../../services/getUsuarios'

const NuevaPrioridadChat = () => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [showM, setShowM] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [color, setColor] = useState('danger')
  const [titulo, setTitulo] = useState('Error!')
  const [resultsUsuarios, setListUsuarios] = useState([])

  const [form, setValues] = useState({
    id_usuario: '',
    id_usuario_prioridad: '',
  })

  useEffect(() => {
    let mounted = true
    let objeto = 'Modulo PrioridadChat'
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getUsuarios(null, null, null, null, session.api_token).then((items) => {
      if (mounted) {
        setListUsuarios(items.users)
      }
    })
    return () => (mounted = false)
  }, [])

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    if (form.id_usuario !== '' && form.id_usuario_prioridad !== '') {
      event.preventDefault()
      const respuesta = await postUsuarioPrioridadMensajes(
        '',
        form.id_usuario,
        form.id_usuario_prioridad,
        '',
        '',
        '',
        session.id,
        session.api_token,
      )
      if (respuesta === 'OK') {
        history.push('/prioridadchat')
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
                <h1>Agreguar usuario a prioridad</h1>
                <p className="text-medium-emphasis">
                  Cree una nuevo registro para priorizar usuario en chat
                </p>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiUserCheck />
                  </CInputGroupText>
                  <CFormSelect name="id_usuario" onChange={handleInput}>
                    <option value="0">Seleccione un usuario.</option>
                    {resultsUsuarios.map((item, i) => {
                      if (item.eliminado == 0 && item.activo == 1) {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.nombre + ' ' + item.apellido + ' [' + item.nombre_usuario + ']'}
                          </option>
                        )
                      }
                    })}
                  </CFormSelect>
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiUserPlus />
                  </CInputGroupText>
                  <CFormSelect name="id_usuario_prioridad" onChange={handleInput}>
                    <option value="0">Seleccione usuario a priorizar</option>
                    {resultsUsuarios.map((item, i) => {
                      if (item.eliminado == 0 && item.activo == 1) {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.nombre + ' ' + item.apellido + ' [' + item.nombre_usuario + ']'}
                          </option>
                        )
                      }
                    })}
                  </CFormSelect>
                </CInputGroup>
                <CButton color="primary" onClick={handleSubmit}>
                  Crear Prioridad
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

export default NuevaPrioridadChat
