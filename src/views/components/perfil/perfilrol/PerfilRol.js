import React, { useState, useEffect } from 'react'
import { useSession } from 'react-use-session'
import { Alert } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import { postPerfilRol } from '../../../../services/postPerfilRol'
import { getRoles } from '../../../../services/getRoles'
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
import { FiUserPlus } from 'react-icons/fi'
import '../../../../scss/estilos.scss'

const PerfilRol = () => {
  const history = useHistory()
  const location = useLocation()
  const { session } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
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
    const respuesta = await postPerfilRol('', location.id_perfil, result, '', '', '')
    if (respuesta === 'OK') {
      history.push('/perfiles/perfiles')
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
  }

  if (session) {
    if (location.id_perfil) {
      return (
        <div style={{ flexDirection: 'row' }}>
          <CContainer>
            <Alert show={show} variant={color} onClose={() => setShow(false)} dismissible>
              <Alert.Heading>{titulo}</Alert.Heading>
              <p>{mensaje}</p>
            </Alert>
            <CCard style={{ display: 'flex', alignItems: 'center' }}>
              <CCardBody style={{ width: '80%' }}>
                <CForm style={{ width: '100%' }} onSubmit={handleSubmit}>
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
                    if (item.eliminado !== '1' && item.activo !== '0') {
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
      history.push('/perfiles/perfiles')
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
