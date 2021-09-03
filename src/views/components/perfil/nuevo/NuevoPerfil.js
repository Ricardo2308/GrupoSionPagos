import React, { useState } from 'react'
import { useSession } from 'react-use-session'
import { Alert } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { BiUserCircle } from 'react-icons/bi'
import { postCrudPerfil } from '../../../../services/postCrudPerfil'
import '../../../../scss/estilos.scss'
import {
  CButton,
  CCard,
  CCardBody,
  CContainer,
  CForm,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'

const NuevoPerfil = (props) => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [color, setColor] = useState('danger')
  const [titulo, setTitulo] = useState('Error!')

  const [form, setValues] = useState({
    descripcion: '',
  })

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    if (form.descripcion !== '') {
      event.preventDefault()
      const respuesta = await postCrudPerfil('', form.descripcion, '', '')
      if (respuesta === 'OK') {
        history.push('/perfiles')
      }
    } else {
      setShow(true)
      setTitulo('Error!')
      setColor('danger')
      setMensaje('No has ingresado ninguna descripción.')
    }
  }

  if (session) {
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
                <h1>Creación de Perfil</h1>
                <p className="text-medium-emphasis">Cree un nuevo perfil</p>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <BiUserCircle />
                  </CInputGroupText>
                  <textarea
                    placeholder="Descripción"
                    className="form-control"
                    rows="2"
                    onChange={handleInput}
                    name="descripcion"
                  ></textarea>
                </CInputGroup>
                <CButton color="primary" block type="submit">
                  Crear Perfil
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

export default NuevoPerfil
