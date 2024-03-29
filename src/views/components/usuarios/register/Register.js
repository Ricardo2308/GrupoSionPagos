import React, { useState } from 'react'
import { useSession } from 'react-use-session'
import { Alert, Modal } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useIdleTimer } from 'react-idle-timer'
import { FiUser, FiLock, FiAtSign } from 'react-icons/fi'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { postCrearUsuario } from '../../../../services/postCrearUsuario'
import '../../../../scss/estilos.scss'
import md5 from 'md5'
import {
  CButton,
  CCard,
  CCardBody,
  CContainer,
  CForm,
  CFormControl,
  CFormCheck,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'

const Register = (props) => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [showM, setShowM] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [color, setColor] = useState('danger')
  const [titulo, setTitulo] = useState('Error!')

  const [form, setValues] = useState({
    nombre: '',
    apellido: '',
    usuario: '',
    email: '',
    password: '',
    password_repetida: '',
  })

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    let result = 0
    if (
      form.nombre !== '' &&
      form.apellido !== '' &&
      form.usuario !== '' &&
      form.email !== '' &&
      form.password !== '' &&
      form.password_repetida !== ''
    ) {
      if (form.password === form.password_repetida) {
        if (form.password.length >= 10) {
          event.preventDefault()
          var markedCheckbox = document.getElementsByName('cambiapassword')
          for (var checkbox of markedCheckbox) {
            if (checkbox.checked) {
              result = 1
            } else {
              result = 0
            }
          }
          const respuesta = await postCrearUsuario(
            form.nombre,
            form.apellido,
            form.usuario,
            form.email,
            md5(form.password_repetida, { encoding: 'binary' }),
            result,
          )
          if (respuesta === 'OK') {
            history.push('/usuarios')
          } else if (respuesta === 'Repetido') {
            setShow(true)
            setTitulo('Usuario repetido!')
            setMensaje('Un usuario ya tiene asociado este correo. Intente con otro.')
          }
        } else {
          if (form.password.length < 5) {
            setShow(true)
            setTitulo('Contraseña muy débil!')
            setMensaje('La contraseña debe contener al menos 10 caracteres.')
          } else if (form.password.length >= 5 || form.password.length < 10) {
            setShow(true)
            setTitulo('Contraseña débil!')
            setMensaje('La contraseña debe contener al menos 10 caracteres.')
            setColor('warning')
          }
        }
      } else {
        setShow(true)
        setMensaje('Las contraseñas no coinciden.')
      }
    } else {
      setShow(true)
      setMensaje('No has llenado todos los campos.')
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
                <h1>Creación de Usuario</h1>
                <p className="text-medium-emphasis">Crear un nuevo usuario</p>
                <div className="float-right" style={{ marginBottom: '10px' }}>
                  <CFormCheck
                    value=""
                    type="checkbox"
                    name="cambiapassword"
                    label="Cambiar Contraseña"
                    defaultChecked={true}
                  />
                </div>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiUser />
                  </CInputGroupText>
                  <CFormControl
                    type="text"
                    placeholder="Nombre"
                    name="nombre"
                    onChange={handleInput}
                  />
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiUser />
                  </CInputGroupText>
                  <CFormControl
                    type="text"
                    placeholder="Apellido"
                    name="apellido"
                    onChange={handleInput}
                  />
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiUser />
                  </CInputGroupText>
                  <CFormControl
                    type="text"
                    placeholder="Nombre Usuario"
                    name="usuario"
                    onChange={handleInput}
                  />
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiAtSign />
                  </CInputGroupText>
                  <CFormControl
                    type="email"
                    placeholder="Correo"
                    name="email"
                    onChange={handleInput}
                  />
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiLock />
                  </CInputGroupText>
                  <CFormControl
                    type="password"
                    placeholder="Contraseña"
                    name="password"
                    onChange={handleInput}
                  />
                </CInputGroup>
                <CInputGroup className="mb-4">
                  <CInputGroupText>
                    <FiLock />
                  </CInputGroupText>
                  <CFormControl
                    type="password"
                    placeholder="Repetir Contraseña"
                    name="password_repetida"
                    onChange={handleInput}
                  />
                </CInputGroup>
                <CButton color="primary" onClick={handleSubmit}>
                  Crear Usuario
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

export default Register
