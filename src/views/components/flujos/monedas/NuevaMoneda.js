import React, { useState } from 'react'
import { useSession } from 'react-use-session'
import { Alert } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { postCrudMonedas } from '../../../../services/postCrudMonedas'
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
import { MdAttachMoney } from 'react-icons/md'
import { FaCoins } from 'react-icons/fa'

const NuevaMoneda = (props) => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const [form, setValues] = useState({
    nombre: '',
    simbolo: '',
  })

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    if (form.nombre !== '' && form.simbolo !== '') {
      event.preventDefault()
      const respuesta = await postCrudMonedas('', form.nombre, form.simbolo, '', '')
      if (respuesta === 'OK') {
        history.push('/monedas')
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
                <h1>Creación de Moneda</h1>
                <p className="text-medium-emphasis">Cree una nueva moneda</p>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FaCoins />
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
                    <MdAttachMoney />
                  </CInputGroupText>
                  <CFormControl
                    type="text"
                    placeholder="Simbolo"
                    name="simbolo"
                    onChange={handleInput}
                  />
                </CInputGroup>
                <CButton color="primary" type="submit" block>
                  Crear Moneda
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

export default NuevaMoneda
