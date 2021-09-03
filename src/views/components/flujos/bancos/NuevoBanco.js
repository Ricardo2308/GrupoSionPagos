import React, { useState } from 'react'
import { useSession } from 'react-use-session'
import { Alert } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { postCrudBancos } from '../../../../services/postCrudBancos'
import { GrLocation } from 'react-icons/gr'
import { RiBankLine } from 'react-icons/ri'
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
} from '@coreui/react'

const NuevoBanco = (props) => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const [form, setValues] = useState({
    nombre: '',
    direccion: '',
  })

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    if (form.nombre !== '' && form.direccion !== '') {
      event.preventDefault()
      const respuesta = await postCrudBancos('', form.nombre, form.direccion, '', '')
      if (respuesta === 'OK') {
        history.push('/bancos')
      }
    } else {
      setShow(true)
      setMensaje('No has llenado todos los campos.')
    }
  }

  if (session) {
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
                <h1>Creación de Banco</h1>
                <p className="text-medium-emphasis">Registre un nuevo banco</p>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <RiBankLine />
                  </CInputGroupText>
                  <CFormControl
                    type="text"
                    placeholder="Nombre"
                    name="nombre"
                    onChange={handleInput}
                  />
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <GrLocation />
                  </CInputGroupText>
                  <CFormControl
                    type="text"
                    placeholder="Direccion"
                    name="direccion"
                    onChange={handleInput}
                  />
                </CInputGroup>
                <CButton color="primary" type="submit" block>
                  Crear Banco
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CContainer>
      </div>
    )
  } else {
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default NuevoBanco
