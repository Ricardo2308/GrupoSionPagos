import React, { useState, useEffect } from 'react'
import { useSession } from 'react-use-session'
import { Alert, Modal, Button } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { useHistory, useLocation } from 'react-router-dom'
import { postFlujos } from '../../../../services/postFlujos'
import { postFlujoDetalle } from '../../../../services/postFlujoDetalle'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { getGruposAutorizacion } from '../../../../services/getGruposAutorizacion'
import { getSugerenciaAsignacionFlujo } from '../../../../services/getSugerenciaAsignacionFlujo'
import '../../../../scss/estilos.scss'
import { FiCreditCard, FiUsers } from 'react-icons/fi'
import { FaUsers, FaArrowLeft } from 'react-icons/fa'
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
  CFormCheck,
} from '@coreui/react'
import { postReasignacion } from '../../../../services/postReasignacion'

const ReasignarGrupo = (props) => {
  const history = useHistory()
  const location = useLocation()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [showM, setShowM] = useState(false)
  const [results, setList] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [sugerencias, setSugerencias] = useState([])
  const [showRadio, setShowRadio] = useState(false)
  const [haySugerencias, setHaySugerencias] = useState(false)
  const [inputSeleccion, setInputSeleccion] = useState('')

  const [form, setValues] = useState({
    grupo_autorizacion: '',
    estado: '',
    grupo_autorizacion_radio: '',
  })

  useEffect(() => {
    let mounted = true
    getGruposAutorizacion(null, null, session.api_token).then((items) => {
      if (mounted) {
        setList(items.grupos)
      }
    })
    getSugerenciaAsignacionFlujo(location.id_flujo, session.api_token).then((items) => {
      if (mounted) {
        setSugerencias(items.sugerencias)
        if (items.sugerencias.length > 0) {
          setShowRadio(true)
          setHaySugerencias(true)
        }
      }
    })
    return () => (mounted = false)
  }, [])

  const handleInput = (event) => {
    if (event.target.name == 'grupo_autorizacion') {
      if (event.target.value == 0 && haySugerencias) {
        setShowRadio(true)
        setInputSeleccion('grupo_autorizacion_radio')
      } else {
        setShowRadio(false)
        setInputSeleccion('grupo_autorizacion')
      }
    }
    if (event.target.name == 'grupo_autorizacion_radio') {
      setInputSeleccion('grupo_autorizacion_radio')
    }
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    if (form.grupo_autorizacion !== '' || form.grupo_autorizacion_radio !== '') {
      event.preventDefault()
      let id_grupo_autorizacion = ''
      if (inputSeleccion == 'grupo_autorizacion') {
        id_grupo_autorizacion = form.grupo_autorizacion
      } else {
        id_grupo_autorizacion = form.grupo_autorizacion_radio
      }
      const respuesta = await postReasignacion(
        location.id_flujo,
        id_grupo_autorizacion,
        session.id,
        session.api_token,
      )
      if (respuesta === 'OK') {
        /* const answer = await postFlujoDetalle(
          location.id_flujo,
          '3',
          session.id,
          'Asignado a responsable',
          '0',
          session.api_token,
        ) */
        //if (answer === 'OK') {
        history.go(-1)
        //}
      }
    } else {
      event.preventDefault()
      setShow(true)
    }
  }
  if (session) {
    if (location.id_flujo) {
      return (
        <div style={{ flexDirection: 'row' }}>
          <CContainer>
            <Alert show={show} variant="danger" onClose={() => setShow(false)} dismissible>
              <Alert.Heading>Error!</Alert.Heading>
              <p>No has llenado todos los campos.</p>
            </Alert>
            <div className="float-left" style={{ marginBottom: '10px' }}>
              <Button variant="primary" size="sm" onClick={() => history.goBack()}>
                <FaArrowLeft />
                &nbsp;&nbsp;Regresar
              </Button>
            </div>
            <br />
            <br />
            <CCard style={{ display: 'flex', alignItems: 'center' }}>
              <CCardBody style={{ width: '80%' }}>
                <CForm style={{ width: '100%' }} onSubmit={handleSubmit}>
                  <h1>Reasignación de Grupo de Autorización</h1>
                  <p className="text-medium-emphasis">Reasigne un grupo de autorización al pago</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FiCreditCard />
                    </CInputGroupText>
                    <CFormControl
                      type="text"
                      placeholder="Nombre"
                      name="nombre"
                      value={location.pago}
                      disabled={true}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FiUsers />
                    </CInputGroupText>
                    <CFormControl
                      type="text"
                      placeholder="GrupoActual"
                      name="grupoactual"
                      value={location.grupoActual}
                      disabled={true}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FaUsers />
                    </CInputGroupText>
                    <CFormSelect name="grupo_autorizacion" onChange={handleInput}>
                      <option value="0">Seleccione un grupo de autorización. (Obligatorio)</option>
                      {results.map((item, i) => {
                        if (item.eliminado == 0 && item.activo == 1) {
                          return (
                            <option key={item.id_grupo} value={item.id_grupo}>
                              {item.identificador}
                            </option>
                          )
                        }
                      })}
                    </CFormSelect>
                  </CInputGroup>
                  {/*                   <CInputGroup className={!showRadio ? 'd-none mb-3' : 'mb-3'}>
                    <div>
                      Sugerencias de grupos para pago
                      <br />
                      <br />
                    </div>
                    {sugerencias.map((item, i) => {
                      return (
                        <>
                          <CInputGroup key={i}>
                            <CFormCheck
                              key={item.id_grupoautorizacion}
                              value={item.id_grupoautorizacion}
                              type="radio"
                              name="grupo_autorizacion_radio"
                              label={item.identificador}
                              onChange={handleInput}
                            />
                          </CInputGroup>
                        </>
                      )
                    })}
                  </CInputGroup> */}
                  <CButton color="primary" type="submit" block>
                    Guardar Cambios
                  </CButton>
                </CForm>
              </CCardBody>
            </CCard>
          </CContainer>
        </div>
      )
    } else {
      history.go(-1)
      return (
        <div className="sin-sesion">
          NO SE CARGÓ EL CÓDIGO DEL FLUJO. REGRESE A LA PANTALLA DE PAGOS.
        </div>
      )
    }
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default ReasignarGrupo
