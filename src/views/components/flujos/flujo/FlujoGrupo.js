import React, { useState, useEffect } from 'react'
import { useSession } from 'react-use-session'
import { Alert, Modal } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { useHistory, useLocation } from 'react-router-dom'
import { postFlujos } from '../../../../services/postFlujos'
import { postFlujoDetalle } from '../../../../services/postFlujoDetalle'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { getGruposAutorizacion } from '../../../../services/getGruposAutorizacion'
import '../../../../scss/estilos.scss'
import { FiCreditCard } from 'react-icons/fi'
import { FaUsers } from 'react-icons/fa'
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

const FlujoGrupo = (props) => {
  const history = useHistory()
  const location = useLocation()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [showM, setShowM] = useState(false)
  const [results, setList] = useState([])
  const [mensaje, setMensaje] = useState('')

  const [form, setValues] = useState({
    grupo_autorizacion: '',
    estado: '',
  })

  useEffect(() => {
    let mounted = true
    getGruposAutorizacion(null, null).then((items) => {
      if (mounted) {
        setList(items.grupos)
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
    if (form.grupo_autorizacion !== '') {
      event.preventDefault()
      const respuesta = await postFlujos(location.id_flujo, '', form.grupo_autorizacion, '', null)
      if (respuesta === 'OK') {
        const answer = await postFlujoDetalle(
          location.id_flujo,
          '3',
          session.id,
          'Asignado a responsable',
          '0',
        )
        if (answer === 'OK') {
          history.go(-1)
        }
      }
    } else {
      setShow(true)
    }
  }

  function iniciar(minutos) {
    let segundos = 60 * minutos
    const intervalo = setInterval(() => {
      segundos--
      if (segundos == 0) {
        Cancelar(2)
      }
    }, 1000)
    setTime(intervalo)
  }

  function detener() {
    clearInterval(time)
  }

  const handleOnIdle = (event) => {
    setShowM(true)
    setMensaje(
      'Ya estuvo mucho tiempo sin realizar ninguna acción. Se cerrará sesión en unos minutos.' +
        ' Si desea continuar presione Aceptar',
    )
    iniciar(2)
    console.log('last active', getLastActiveTime())
  }

  const handleOnActive = (event) => {
    console.log('time remaining', getRemainingTime())
  }

  const handleOnAction = (event) => {}

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * parseInt(session == null ? 1 : session.limiteconexion),
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500,
  })

  async function Cancelar(opcion) {
    if (opcion == 1) {
      setShowM(false)
      detener()
    } else if (opcion == 2) {
      let idUsuario = 0
      if (session) {
        idUsuario = session.id
      }
      const respuesta = await postSesionUsuario(idUsuario, null, null, '2')
      if (respuesta === 'OK') {
        clear()
        history.push('/')
      }
      detener()
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
            <CCard style={{ display: 'flex', alignItems: 'center' }}>
              <CCardBody style={{ width: '80%' }}>
                <CForm style={{ width: '100%' }} onSubmit={handleSubmit}>
                  <h1>Asignación de Grupo de Autorización</h1>
                  <p className="text-medium-emphasis">Asigne un grupo de autorización al pago</p>
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
                      <FaUsers />
                    </CInputGroupText>
                    <CFormSelect name="grupo_autorizacion" onChange={handleInput}>
                      <option>Seleccione un grupo de autorización. (Obligatorio)</option>
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
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default FlujoGrupo
