import React, { useState, useEffect } from 'react'
import { useSession } from 'react-use-session'
import { Alert } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import { postUsuarioGrupo } from '../../../../services/postUsuarioGrupo'
import { getGruposAutorizacion } from '../../../../services/getGruposAutorizacion'
import { FiUser, FiAtSign } from 'react-icons/fi'
import { FaUsers } from 'react-icons/fa'
import { FaNetworkWired } from 'react-icons/fa'
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
  CFormSelect,
} from '@coreui/react'

const AgregarGrupo = (props) => {
  const history = useHistory()
  const location = useLocation()
  const { session } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [results, setList] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [titulo, setTitulo] = useState('Error!')
  const [color, setColor] = useState('danger')
  const [idUsuario, setIdUsuario] = useState(0)

  const handleClose = () => setShow(false)

  const [form, setValues] = useState({
    grupo_autorizacion: '',
    estado: '',
    nivel: '',
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

  function obtenerNiveles(num_niveles) {
    var niveles = []
    for (let i = 0; i < num_niveles; i++) {
      niveles.push(i + 1)
    }
    return niveles
  }

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    if (form.grupo_autorizacion !== '' && form.nivel !== '') {
      event.preventDefault()
      const respuesta = await postUsuarioGrupo(
        '',
        location.id_usuario,
        '',
        form.grupo_autorizacion,
        form.nivel,
        '',
      )
      if (respuesta === 'OK') {
        history.push('/usuarios')
      } else if (respuesta === 'Error') {
        setShow(true)
        setMensaje('Error de conexión.')
      } else if (respuesta === 'Repetido') {
        setShow(true)
        setTitulo('Aviso!')
        setColor('warning')
        setMensaje(
          'El grupo de autorización seleccionado ya fue elegido para este usuario!' +
            ' Intente con otro.',
        )
      }
    } else {
      setShow(true)
      setTitulo('Error!')
      setColor('danger')
      setMensaje('No has llenado todos los campos')
    }
  }

  function mostrarModal(id_usuario) {
    setIdUsuario(id_usuario)
    setShow(true)
  }

  async function editarUsuarioGrupo(id_usuario) {
    const respuesta = await postUsuarioGrupo(
      '0',
      id_usuario,
      '2',
      form.grupo_autorizacion,
      form.nivel,
      '',
    )
    if (respuesta === 'OK') {
      history.push('/usuarios')
    }
  }

  if (session) {
    if (location.id_usuario) {
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
                  <h1>Asignación de Grupo de Autorización</h1>
                  <p className="text-medium-emphasis">Asigne un grupo de autorización al usuario</p>
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
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FaUsers />
                    </CInputGroupText>
                    <CFormSelect name="grupo_autorizacion" onChange={handleInput}>
                      <option>Primero seleccione un grupo. (Opcional)</option>
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
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FaNetworkWired />
                    </CInputGroupText>
                    <CFormSelect name="nivel" onChange={handleInput}>
                      <option>Luego un nivel de autorización. (Opcional)</option>
                      {results.map((item, i) => {
                        if (item.id_grupo == form.grupo_autorizacion) {
                          var niveles = obtenerNiveles(item.numero_niveles)
                          return niveles.map((nivel) => {
                            return (
                              <option key={nivel.toString()} value={nivel}>
                                {nivel}
                              </option>
                            )
                          })
                        }
                      })}
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
      history.push('/usuarios')
      return (
        <div className="sin-sesion">
          NO SE CARGÓ EL CÓDIGO DEL USUARIO. REGRESE A LA PANTALLA DE USUARIOS.
        </div>
      )
    }
  } else {
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default AgregarGrupo