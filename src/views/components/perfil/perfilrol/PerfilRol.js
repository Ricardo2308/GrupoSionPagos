import React, { useState, useEffect } from 'react'
import { useSession } from 'react-use-session'
import { Alert, Modal } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { useHistory, useLocation } from 'react-router-dom'
import { postPerfilRol } from '../../../../services/postPerfilRol'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { getRoles } from '../../../../services/getRoles'
import { FiUserPlus } from 'react-icons/fi'
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
  CFormCheck,
} from '@coreui/react'

const PerfilRol = () => {
  const history = useHistory()
  const location = useLocation()
  const { session, clear } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [showM, setShowM] = useState(false)
  const [results, setList] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [titulo, setTitulo] = useState('Error!')
  const [color, setColor] = useState('danger')
  const [form, setValues] = useState({
    estado: '',
  })

  useEffect(() => {
    let mounted = true
    getRoles(null, null).then((items) => {
      if (mounted) {
        setList(items.roles)
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
    let result = ''
    event.preventDefault()
    var markedCheckbox = document.getElementsByName('estado')
    for (var checkbox of markedCheckbox) {
      if (checkbox.checked) {
        result += checkbox.value + '|'
      }
    }
    if (result !== '') {
      const respuesta = await postPerfilRol('', location.id_perfil, result, '', '', '')
      if (respuesta === 'OK') {
        history.push('/perfiles')
      } else if (respuesta === 'Error') {
        setShow(true)
        setTitulo('Error!')
        setMensaje('Error de conexión.')
      } else if (respuesta === 'Repetidos') {
        setShow(true)
        setTitulo('Aviso!')
        setColor('warning')
        setMensaje(
          'Los roles seleccionados ya fueron elegidos para este perfil!' + ' Intente con otros.',
        )
      }
    } else {
      setShow(true)
      setTitulo('Error!')
      setColor('danger')
      setMensaje('No has seleccionado ningún rol.')
    }
  }

  const handleOnIdle = (event) => {
    setShowM(true)
    setMensaje(
      'Ya estuvo mucho tiempo sin realizar ninguna acción. Si desea continuar presione aceptar.',
    )
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
    }
  }

  if (session) {
    if (location.id_perfil) {
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
            <Alert show={show} variant={color} onClose={() => setShow(false)} dismissible>
              <Alert.Heading>{titulo}</Alert.Heading>
              <p>{mensaje}</p>
            </Alert>
            <CCard style={{ display: 'flex', alignItems: 'center' }}>
              <CCardBody style={{ width: '80%' }}>
                <CForm style={{ width: '100%' }}>
                  <h1>Asignación de Roles</h1>
                  <p className="text-medium-emphasis">Asigne algún rol al perfil</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FiUserPlus />
                    </CInputGroupText>
                    <CFormControl
                      type="text"
                      placeholder="Nombre"
                      name="nombre"
                      value={location.descripcion}
                      disabled={true}
                    />
                  </CInputGroup>
                  {results.map((item, i) => {
                    if (item.eliminado == 0 && item.activo == 1) {
                      return (
                        <CFormCheck
                          key={item.id_rol}
                          value={item.id_rol}
                          type="checkbox"
                          name="estado"
                          label={item.descripcion}
                          onChange={handleInput}
                        />
                      )
                    }
                  })}
                  <br />
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
      history.push('/perfiles')
      return (
        <div className="sin-sesion">
          NO SE CARGÓ EL CÓDIGO DEL PERFIL. REGRESE A LA PANTALLA DE PERFILES.
        </div>
      )
    }
  } else {
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default PerfilRol
