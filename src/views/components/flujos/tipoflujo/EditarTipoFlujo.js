import React, { useState, useEffect } from 'react'
import { useSession } from 'react-use-session'
import { Alert } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import { getEstadosFlujo } from '../../../../services/getEstadosFlujo'
import { postTipoFlujo } from '../../../../services/postTipoFlujo'
import {
  CButton,
  CCard,
  CCardBody,
  CContainer,
  CForm,
  CInputGroupText,
  CInputGroup,
  CFormSelect,
} from '@coreui/react'
import { FiSettings, FiGrid } from 'react-icons/fi'
import '../../../../scss/estilos.scss'

const EditarEstadoFlujo = () => {
  const history = useHistory()
  const location = useLocation()
  const [results, setList] = useState([])
  const { session } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const [form, setValues] = useState({
    descripcion: location.descripcion,
    estado_inicial: location.id_estadoinicial,
    estado: location.estado,
  })

  useEffect(() => {
    let mounted = true
    getEstadosFlujo(null, null).then((items) => {
      if (mounted) {
        setList(items.estados)
        console.log(items)
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
    if (form.descripcion !== '' && form.estado !== '') {
      event.preventDefault()
      const respuesta = await postTipoFlujo(
        location.id_tipoflujo,
        form.descripcion,
        form.estado_inicial,
        form.estado,
        '1',
      )
      if (respuesta === 'OK') {
        history.push('/tipoflujo/tipos')
      }
    } else {
      setShow(true)
      setMensaje('No has llenado todos los campos')
    }
  }

  if (session) {
    if (location.id_tipoflujo) {
      return (
        <div style={{ flexDirection: 'row' }}>
          <CContainer>
            <Alert show={show} variant="danger" onClose={() => setShow(false)} dismissible>
              <Alert.Heading>Error!</Alert.Heading>
              <p>{mensaje}</p>
            </Alert>
            <CCard style={{ display: 'flex', alignItems: 'center' }}>
              <CCardBody style={{ width: '80%' }}>
                <CForm style={{ width: '100%' }} onSubmit={handleSubmit}>
                  <h1>Modificación del Estado de Flujo</h1>
                  <p className="text-medium-emphasis">
                    Modifique la información del estado de flujo
                  </p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FiGrid />
                    </CInputGroupText>
                    <textarea
                      placeholder="Descripción"
                      name="descripcion"
                      className="form-control"
                      rows="2"
                      onChange={handleInput}
                      defaultValue={location.descripcion}
                    ></textarea>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FiSettings />
                    </CInputGroupText>
                    <CFormSelect name="estado_inicial" onChange={handleInput}>
                      <option>Seleccione un grupo superior. (Opcional)</option>
                      {results.map((item, i) => {
                        if (item.estado_eliminado !== '1' && item.estado_activo !== '0') {
                          return (
                            <option key={item.id_estadoflujo} value={item.id_estadoflujo}>
                              {item.descripcion}
                            </option>
                          )
                        }
                      })}
                    </CFormSelect>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FiSettings />
                    </CInputGroupText>
                    <CFormSelect name="estado" onChange={handleInput}>
                      <option>Seleccione estado. (Opcional)</option>
                      <option value="1">Activo</option>
                      <option value="0">Inactivo</option>
                    </CFormSelect>
                  </CInputGroup>
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
      history.push('/tipoflujo/tipos')
      return (
        <div className="sin-sesion">
          NO SE CARGÓ EL CÓDIGO DEL TIPO DE FLUJO. REGRESE A LA PANTALLA DE TIPOS DE FLUJO.
        </div>
      )
    }
  } else {
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default EditarEstadoFlujo
