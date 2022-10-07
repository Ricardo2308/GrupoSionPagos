import React, { useState, useEffect } from 'react'
import { useSession } from 'react-use-session'
import { Alert, Modal, Button } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { useHistory, useLocation } from 'react-router-dom'
import { postRolPermiso } from '../../../../services/postRolPermiso'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { getPermisos } from '../../../../services/getPermisos'
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
import { FaArrowLeft } from 'react-icons/fa'

const RolPermiso = () => {
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
    estado: '',
  })

  useEffect(() => {
    let mounted = true
    getPermisos(null, null, session.api_token).then((items) => {
      if (mounted) {
        setList(items.permisos)
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
      const respuesta = await postRolPermiso(
        '',
        location.id_rol,
        result,
        '',
        '',
        '',
        session.id,
        session.api_token,
      )
      if (respuesta === 'OK') {
        history.push('/roles')
      } else if (respuesta === 'Error') {
        setShow(true)
        setTitulo('Error!')
        setMensaje('Error de conexión.')
      } else if (respuesta === 'Repetidos') {
        setShow(true)
        setTitulo('Aviso!')
        setColor('warning')
        setMensaje(
          'Los permisos seleccionados ya fueron elegidos para este rol!' + ' Intente con otros.',
        )
      }
    } else {
      setShow(true)
      setTitulo('Error!')
      setColor('danger')
      setMensaje('No has seleccionado ningún permiso.')
    }
  }

  if (session) {
    if (location.id_rol) {
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
                          key={item.id_permiso}
                          value={item.id_permiso}
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
      history.push('/roles')
      return (
        <div className="sin-sesion">
          NO SE CARGÓ EL CÓDIGO DEL ROL. REGRESE A LA PANTALLA DE ROLES.
        </div>
      )
    }
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default RolPermiso
