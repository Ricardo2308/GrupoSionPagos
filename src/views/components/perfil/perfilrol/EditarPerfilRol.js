import React, { useState, useEffect } from 'react'
import { useSession } from 'react-use-session'
import { Alert } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { useHistory, useLocation } from 'react-router-dom'
import { postPerfilRol } from '../../../../services/postPerfilRol'
import { getRoles } from '../../../../services/getRoles'
import { getPerfilRol } from '../../../../services/getPerfilRol'
import { FiUser, FiSettings } from 'react-icons/fi'
import { BiUserCircle } from 'react-icons/bi'
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

const EditarPerfilRol = () => {
  const history = useHistory()
  const location = useLocation()
  const { session } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [results, setList] = useState([])
  const [results1, setList1] = useState([])
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')
  const [titulo, setTitulo] = useState('Error!')
  const [color, setColor] = useState('danger')

  const [form, setValues] = useState({
    rol: location.id_rol,
    estado: location.estado,
  })

  useEffect(() => {
    let mounted = true
    getRoles(null, null).then((items) => {
      if (mounted) {
        setList(items.roles)
      }
    })
    getPerfilRol(location.id_perfil, null).then((items) => {
      if (mounted) {
        setList1(items.detalle)
      }
    })
    return () => (mounted = false)
  }, [])

  function Repetido(dato) {
    let result = 0
    for (let item of results1) {
      if (dato === item.id_rol) {
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
    if (Repetido(form.rol)) {
      setShow(true)
      setTitulo('Repetido!')
      setColor('warning')
      setMensaje('Este rol ya está asociado con el perfil. Intente con otro!')
    } else {
      if (form.rol !== '' && form.estado !== '') {
        event.preventDefault()
        const respuesta = await postPerfilRol(
          location.id_perfilrol,
          location.id_perfil,
          '',
          '2',
          form.rol,
          form.estado,
        )
        if (respuesta === 'OK') {
          history.push('/perfiles')
        }
      } else {
        setShow(true)
        setTitulo('Error!')
        setColor('danger')
        setMensaje('No has llenado todos los campos')
      }
    }
  }

  const handleOnIdle = (event) => {
    setShow(true)
    setOpcion(2)
    setMensaje('Ya estuvo mucho tiempo sin realizar ninguna acción. Desea continuar?')
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

  if (session) {
    if (location.id_perfilrol) {
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
                  <h1>Modificación de los Roles del Perfil.</h1>
                  <p className="text-medium-emphasis">
                    Modifique la información de los roles del perfil.
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
                    <CFormSelect name="rol" onChange={handleInput}>
                      <option>Seleccione un nuevo rol. (Opcional)</option>
                      {results.map((item, i) => {
                        if (item.eliminado == 0 && item.activo == 1) {
                          return (
                            <option key={item.id_rol} value={item.id_rol}>
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

export default EditarPerfilRol
