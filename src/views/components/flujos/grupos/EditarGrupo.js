import React, { useState, useEffect } from 'react'
import { useSession } from 'react-use-session'
import { Alert } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import { postGruposAutorizacion } from '../../../../services/postGruposAutorizacion'
import { getGruposAutorizacion } from '../../../../services/getGruposAutorizacion'
import { FiUserPlus, FiSettings, FiGrid } from 'react-icons/fi'
import { FaNetworkWired } from 'react-icons/fa'
import '../../../../scss/estilos.scss'
import {
  CButton,
  CCard,
  CCardBody,
  CContainer,
  CForm,
  CInputGroupText,
  CFormControl,
  CInputGroup,
  CFormSelect,
} from '@coreui/react'

const EditarGrupo = () => {
  const history = useHistory()
  const location = useLocation()
  const { session } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const [form, setValues] = useState({
    numero_niveles: location.numero_niveles,
    descripcion: location.descripcion,
    identificador: location.identificador,
    estado: location.estado,
  })

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    if (form.descripcion !== '' && form.identificador !== '' && form.estado !== '') {
      event.preventDefault()
      const respuesta = await postGruposAutorizacion(
        location.id_grupo,
        form.identificador,
        form.descripcion,
        form.numero_niveles,
        form.estado,
        '1',
      )
      if (respuesta === 'OK') {
        history.push('/grupos/grupos')
      }
    } else {
      setShow(true)
      setMensaje('No has llenado todos los campos')
    }
  }

  if (session) {
    if (location.id_grupo) {
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
                  <h1>Modificación de Grupo de Autorización</h1>
                  <p className="text-medium-emphasis">
                    Modifique la información del grupo de autorización
                  </p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FiGrid />
                    </CInputGroupText>
                    <CFormControl
                      type="text"
                      placeholder="Identificador"
                      name="identificador"
                      onChange={handleInput}
                      defaultValue={location.identificador}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FiUserPlus />
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
                      <FaNetworkWired />
                    </CInputGroupText>
                    <CFormControl
                      type="text"
                      placeholder="Número Niveles"
                      name="numero_niveles"
                      defaultValue={location.numero_niveles}
                      onChange={handleInput}
                    />
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
      history.push('/grupos/grupos')
      return (
        <div className="sin-sesion">
          NO SE CARGÓ EL CÓDIGO DEL GRUPO. REGRESE A LA PANTALLA DE GRUPOS.
        </div>
      )
    }
  } else {
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default EditarGrupo
