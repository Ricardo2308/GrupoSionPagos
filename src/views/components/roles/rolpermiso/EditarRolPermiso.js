import React, { useState, useEffect } from 'react'
import { useSession } from 'react-use-session'
import { Alert } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import { postRolPermiso } from '../../../../services/postRolPermiso'
import { getPermisos } from '../../../../services/getPermisos'
import { getRolPermiso } from '../../../../services/getRolPermiso'
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

const EditarRolPermiso = () => {
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
    permiso: location.id_permiso,
    estado: location.estado,
  })

  useEffect(() => {
    let mounted = true
    getPermisos(null, null).then((items) => {
      if (mounted) {
        setList(items.permisos)
      }
    })
    getRolPermiso(location.id_rol, null).then((items) => {
      if (mounted) {
        setList1(items.detalle)
      }
    })
    return () => (mounted = false)
  }, [])

  function Repetido(dato) {
    let result = 0
    for (let item of results1) {
      if (dato === item.id_permiso) {
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
    event.preventDefault()
    if (Repetido(form.permiso)) {
      setShow(true)
      setTitulo('Repetido!')
      setColor('warning')
      setMensaje('Este permiso ya está asociado con el rol. Intente con otro!')
    } else {
      if (form.permiso !== '' && form.estado !== '') {
        const respuesta = await postRolPermiso(
          location.id_rolpermiso,
          location.id_rol,
          '',
          '2',
          form.permiso,
          form.estado,
        )
        if (respuesta === 'OK') {
          history.push('/roles')
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
    if (location.id_rolpermiso) {
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
                  <h1>Modificación de los Permisos del Rol.</h1>
                  <p className="text-medium-emphasis">
                    Modifique la información de los permisos del rol.
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
                    <CFormSelect name="permiso" onChange={handleInput}>
                      <option>Seleccione nuevo permiso. (Opcional)</option>
                      {results.map((item, i) => {
                        if (item.eliminado !== '1' && item.activo !== '0') {
                          return (
                            <option key={item.id_permiso} value={item.id_permiso}>
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
      history.push('/roles')
      return (
        <div className="sin-sesion">
          NO SE CARGÓ EL CÓDIGO DEL ROL. REGRESE A LA PANTALLA DE ROLES.
        </div>
      )
    }
  } else {
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default EditarRolPermiso
