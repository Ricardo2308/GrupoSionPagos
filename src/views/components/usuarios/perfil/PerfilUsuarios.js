import React, { useState, useEffect } from 'react'
import { useSession } from 'react-use-session'
import { Alert, Modal, Button } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { useHistory, useLocation } from 'react-router-dom'
import { postPerfilUsuario } from '../../../../services/postPerfilUsuario'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { getPerfilesParaAsignar } from '../../../../services/getPerfiles'
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
import { FiUser, FiAtSign } from 'react-icons/fi'
import { FaArrowLeft } from 'react-icons/fa'

const PerfilUsuario = () => {
  const history = useHistory()
  const location = useLocation()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [showM, setShowM] = useState(false)
  const [results, setList] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [titulo, setTitulo] = useState('Error!')
  const [color, setColor] = useState('danger')
  const [form, setValues] = useState({
    perfiles: '',
  })

  useEffect(() => {
    let mounted = true
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getPerfilesParaAsignar(location.id, session.api_token).then((items) => {
      if (mounted) {
        setList(items.perfiles)
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
    var markedCheckbox = document.getElementsByName('perfiles')
    for (var checkbox of markedCheckbox) {
      if (checkbox.checked) {
        result += checkbox.value + '|'
      }
    }
    if (result !== '') {
      const respuesta = await postPerfilUsuario(
        '',
        location.id,
        result,
        '',
        '',
        '',
        session.id,
        session.api_token,
      )
      if (respuesta === 'OK') {
        history.push('/usuarios')
      } else if (respuesta === 'Error') {
        setShow(true)
        setTitulo('Error!')
        setMensaje('Error de conexión.')
      } else if (respuesta === 'Repetidos') {
        setShow(true)
        setTitulo('Aviso!')
        setColor('warning')
        setMensaje(
          'Los perfiles seleccionados ya fueron elegidos para este usuario! Intente con otros.',
        )
      }
    } else {
      setShow(true)
      setTitulo('Error!')
      setColor('danger')
      setMensaje('No has seleccionado ningún perfil.')
    }
  }

  if (session) {
    if (location.id) {
      return (
        <div style={{ flexDirection: 'row' }}>
          <CContainer>
            <Alert show={show} variant={color} onClose={() => setShow(false)} dismissible>
              <Alert.Heading>{titulo}</Alert.Heading>
              <p>{mensaje}</p>
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
                <CForm style={{ width: '100%' }}>
                  <h1>Asignación de Perfiles</h1>
                  <p className="text-medium-emphasis">Asigne perfiles al usuario</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FiUser />
                    </CInputGroupText>
                    <CFormControl
                      type="text"
                      placeholder="Nombre"
                      name="nombre"
                      value={location.nombre}
                      disabled={true}
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
                      value={location.email}
                      onChange={handleInput}
                      disabled={true}
                    />
                  </CInputGroup>
                  {results.map((item, i) => {
                    if (item.eliminado == 0 && item.activo == 1) {
                      return (
                        <CFormCheck
                          key={item.id_perfil}
                          value={item.id_perfil}
                          type="checkbox"
                          name="perfiles"
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
      history.push('/usuarios')
      return (
        <div className="sin-sesion">
          NO SE CARGÓ EL CÓDIGO DEL USUARIO. REGRESE A LA PANTALLA DE USUARIOS.
        </div>
      )
    }
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default PerfilUsuario
