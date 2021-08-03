import React, { useState, useEffect } from 'react'
import { useSession } from 'react-use-session'
import { Alert } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import { postPerfilUsuario } from '../../../../services/postPerfilUsuario'
import { getPerfiles } from '../../../../services/getPerfiles'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
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
import { FiUser, FiSettings } from 'react-icons/fi'
import { BiUserCircle } from 'react-icons/bi'

const EditarPerfilUsuario = () => {
  const history = useHistory()
  const location = useLocation()
  const { session } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [results, setList] = useState([])
  const [results1, setList1] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [titulo, setTitulo] = useState('Error!')
  const [color, setColor] = useState('danger')

  const [form, setValues] = useState({
    perfil: location.id_perfil,
    estado: location.estado,
  })

  useEffect(() => {
    let mounted = true
    getPerfiles(null, null).then((items) => {
      if (mounted) {
        setList(items.perfiles)
      }
    })
    getPerfilUsuario(location.id_usuario, null).then((items) => {
      if (mounted) {
        setList1(items.perfil)
      }
    })
    return () => (mounted = false)
  }, [])

  function Repetido(dato) {
    let result = 0
    for (let item of results1) {
      if (dato === item.id_perfil) {
        result = 1
      }
    }
    return result
  }

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    if (Repetido(form.perfil)) {
      setShow(true)
      setTitulo('Repetido!')
      setColor('warning')
      setMensaje('Este perfil ya está asociado con el usuario. Intente con otro!')
    } else {
      if (form.perfil !== '' && form.estado !== '') {
        event.preventDefault()
        const respuesta = await postPerfilUsuario(
          location.id_usuarioperfil,
          location.id_usuario,
          '',
          '3',
          form.perfil,
          form.estado,
        )
        if (respuesta === 'OK') {
          history.push('/base/usuarios')
        }
      } else {
        setShow(true)
        setTitulo('Error!')
        setColor('danger')
        setMensaje('No has llenado todos los campos')
      }
    }
  }

  if (session) {
    if (location.id_usuarioperfil) {
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
                  <h1>Modificación de los Perfiles del Usuario.</h1>
                  <p className="text-medium-emphasis">
                    Modifique la información de los perfiles del usuario.
                  </p>
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
                      <BiUserCircle />
                    </CInputGroupText>
                    <CFormControl type="text" value={location.descripcion} disabled={true} />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FiSettings />
                    </CInputGroupText>
                    <CFormSelect name="perfil" onChange={handleInput}>
                      <option>Seleccione un nuevo perfil. (Opcional)</option>
                      {results.map((item, i) => {
                        if (item.eliminado !== '1' && item.activo !== '0') {
                          return (
                            <option key={item.id_perfil} value={item.id_perfil}>
                              {item.descripcion}
                            </option>
                          )
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
      history.push('/base/usuarios')
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

export default EditarPerfilUsuario