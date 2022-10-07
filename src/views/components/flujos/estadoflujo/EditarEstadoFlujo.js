import React, { useState, useEffect } from 'react'
import { useSession } from 'react-use-session'
import { Alert, Modal, Button } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { useHistory, useLocation } from 'react-router-dom'
import { getEstadosFlujo } from '../../../../services/getEstadosFlujo'
import { postEstadoFlujo } from '../../../../services/postEstadoFlujo'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { FiSettings, FiGrid } from 'react-icons/fi'
import '../../../../scss/estilos.scss'
import {
  CButton,
  CCard,
  CCardBody,
  CContainer,
  CForm,
  CInputGroupText,
  CInputGroup,
  CFormSelect,
} from '@coreui/react'
import { FaArrowLeft } from 'react-icons/fa'

const EditarEstadoFlujo = () => {
  const history = useHistory()
  const location = useLocation()
  const [time, setTime] = useState(null)
  const [results, setList] = useState([])
  const { session, clear } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [showM, setShowM] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const [form, setValues] = useState({
    estadopadre: location.id_estadopadre,
    descripcion: location.descripcion,
    estado: location.estado,
  })

  useEffect(() => {
    let mounted = true
    getEstadosFlujo(null, null, session.api_token).then((items) => {
      if (mounted) {
        setList(items.estados)
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
    if (form.descripcion !== '' && form.estado !== '') {
      event.preventDefault()
      const respuesta = await postEstadoFlujo(
        location.id_estado,
        form.estadopadre,
        form.descripcion,
        form.estado,
        '1',
        session.id,
        session.api_token,
      )
      if (respuesta === 'OK') {
        history.push('/estadosflujo')
      }
    } else {
      setShow(true)
      setMensaje('No has llenado todos los campos')
    }
  }

  if (session) {
    if (location.id_estado) {
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
                  <h1>Modificación del Estado de Flujo</h1>
                  <p className="text-medium-emphasis">
                    Modifique la información del estado de flujo
                  </p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FiGrid />
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
                      <FiSettings />
                    </CInputGroupText>
                    <CFormSelect name="estadopadre" onChange={handleInput}>
                      <option>Seleccione nuevo estado superior. (Opcional)</option>
                      {results.map((item, i) => {
                        if (item.eliminado !== '1' && item.activo !== '0') {
                          return (
                            <option key={item.id_estadoflujo} value={item.id_estadoflujo}>
                              {item.descripcion}
                            </option>
                          )
                        }
                      })}
                    </CFormSelect>
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
      history.push('/estadosflujo')
      return (
        <div className="sin-sesion">
          NO SE CARGÓ EL CÓDIGO DEL ESTADO. REGRESE A LA PANTALLA DE ESTADOS DE PAGO.
        </div>
      )
    }
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default EditarEstadoFlujo
