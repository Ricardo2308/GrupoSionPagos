import React, { useState } from 'react'
import { useSession } from 'react-use-session'
import { Alert } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import md5 from 'md5'
import {
  CButton,
  CCard,
  CCardBody,
  CContainer,
  CForm,
  CFormControl,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import { FiUser, FiLock, FiAtSign } from 'react-icons/fi'
import { postCrearUsuario } from '../../../../services/postCrearUsuario'
import '../../../../scss/estilos.scss'

const Register = (props) => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
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
          const respuesta = await postCrearUsuario(
            form.nombre,
            form.apellido,
            form.usuario,
            form.email,
            md5(form.password_repetida, { encoding: 'binary' }),
          )
          if (respuesta === 'OK') {
            history.push('/base/usuarios')
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

  if (session) {
    return (
      <div style={{ flexDirection: 'row' }}>
        <CContainer>
          <Alert show={show} variant={color} onClose={() => setShow(false)} dismissible>
            <Alert.Heading>{titulo}</Alert.Heading>
            <p>{mensaje}</p>
          </Alert>
          <CCard style={{ display: 'flex', alignItems: 'center' }}>
            <CCardBody style={{ width: '80%' }}>
              <CForm style={{ width: '100%' }}>
                <h1>Creación de Usuario</h1>
                <p className="text-medium-emphasis">Crear un nuevo usuario</p>
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
                <CButton color="primary" block onClick={handleSubmit}>
                  Crear Usuario
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CContainer>
      </div>
    )
  } else {
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default Register