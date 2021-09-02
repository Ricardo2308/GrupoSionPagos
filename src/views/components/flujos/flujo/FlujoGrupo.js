import React, { useState, useEffect } from 'react'
import { useSession } from 'react-use-session'
import { Modal, Alert } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import { postFlujoGrupo } from '../../../../services/postFlujoGrupo'
import { postFlujoDetalle } from '../../../../services/postFlujoDetalle'
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
  const { session } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [results, setList] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [idFlujo, setIdFlujo] = useState(0)

  const handleClose = () => setShow(false)

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
      const respuesta = await postFlujoGrupo('', location.id_flujo, form.grupo_autorizacion, '', '')
      if (respuesta === 'OK') {
        const answer = await postFlujoDetalle(
          location.id_flujo,
          '3',
          session.id,
          'Grupo de autorización asignado',
        )
        if (answer) {
          history.go(-1)
        }
      } else if (respuesta === 'Error') {
        setShow(true)
        setMensaje('Error de conexión.')
      } else if (respuesta === 'Repetido') {
        mostrarModal(location.id_flujo)
        setMensaje('Desea elegir otro grupo de autorización para el usuario?')
      } else {
        console.log(respuesta)
      }
    } else {
      setShowAlert(true)
    }
  }

  function mostrarModal(id_flujo) {
    setIdFlujo(id_flujo)
    setShow(true)
  }

  async function editarFlujoGrupo(id_flujo) {
    const respuesta = await postFlujoGrupo('0', id_flujo, form.grupo_autorizacion, '', '2')
    if (respuesta === 'OK') {
      history.go(-1)
    }
  }

  if (session) {
    if (location.id_flujo) {
      return (
        <div style={{ flexDirection: 'row' }}>
          <CContainer>
            <Alert
              show={showAlert}
              variant="danger"
              onClose={() => setShowAlert(false)}
              dismissible
            >
              <Alert.Heading>Error!</Alert.Heading>
              <p>No has llenado todos los campos.</p>
            </Alert>
            <Modal responsive variant="primary" show={show} onHide={handleClose} centered>
              <Modal.Header closeButton>
                <Modal.Title>Confirmación</Modal.Title>
              </Modal.Header>
              <Modal.Body>{mensaje}</Modal.Body>
              <Modal.Footer>
                <CButton color="secondary" onClick={handleClose}>
                  Cancelar
                </CButton>
                <CButton
                  color="primary"
                  onClick={() => editarFlujoGrupo(idFlujo).then(handleClose)}
                >
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
                        if (item.eliminado !== '1' && item.activo !== '0') {
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
