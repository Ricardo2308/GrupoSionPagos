import React, { useState, useEffect } from 'react'
import { useSession } from 'react-use-session'
import { Alert } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import { postCondicionGrupo } from '../../../../services/postCondicionGrupo'
import { getGruposAutorizacion } from '../../../../services/getGruposAutorizacion'
import { getCondicionGrupo } from '../../../../services/getCondicionGrupo'
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
import { FiAlertOctagon, FiSettings, FiUsers } from 'react-icons/fi'
import '../../../../scss/estilos.scss'

const EditarCondicionGrupo = () => {
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
    grupo: location.id_grupo,
    estado: location.estado,
  })

  useEffect(() => {
    let mounted = true
    getGruposAutorizacion(null, null).then((items) => {
      if (mounted) {
        setList(items.grupos)
      }
    })
    getCondicionGrupo(location.id_condicion, null).then((items) => {
      if (mounted) {
        setList1(items.detalle)
      }
    })
    return () => (mounted = false)
  }, [])

  function Repetido(dato) {
    let result = 0
    for (let item of results1) {
      if (dato === item.id_grupo) {
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
    if (Repetido(form.grupo)) {
      setShow(true)
      setTitulo('Repetido!')
      setColor('warning')
      setMensaje('Este permiso ya está asociado con el rol. Intente con otro!')
    } else {
      if (form.grupo !== '' && form.estado !== '') {
        const respuesta = await postCondicionGrupo(
          location.id_condiciongrupo,
          location.id_condicion,
          '',
          '2',
          form.grupo,
          form.estado,
        )
        if (respuesta === 'OK') {
          history.push('/condiciones')
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
    if (location.id_condiciongrupo) {
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
                  <h1>Modificación de Grupos de la Condición.</h1>
                  <p className="text-medium-emphasis">
                    Modifique la información de los grupos asociados a la condición.
                  </p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FiAlertOctagon />
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
                      <FiUsers />
                    </CInputGroupText>
                    <CFormControl type="text" value={location.identificador} disabled={true} />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FiSettings />
                    </CInputGroupText>
                    <CFormSelect name="grupo" onChange={handleInput}>
                      <option>Seleccione un nuevo grupo. (Opcional)</option>
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
      history.push('/condiciones')
      return (
        <div className="sin-sesion">
          NO SE CARGÓ EL CÓDIGO DE CONDICIÓN. REGRESE A LA PANTALLA DE PAGOS.
        </div>
      )
    }
  } else {
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default EditarCondicionGrupo
