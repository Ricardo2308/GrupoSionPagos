import React, { useState, useEffect } from 'react'
import { useSession } from 'react-use-session'
import { Alert, Modal, Button } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { useHistory } from 'react-router-dom'
import { FiUserPlus, FiLayout, FiUserCheck } from 'react-icons/fi'
import { postCrudUsuarioRestriccionTexto } from '../../../../services/postCrudUsuarioRestriccionTexto'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
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
import { FaArrowLeft } from 'react-icons/fa'
import { getUsuarios } from '../../../../services/getUsuarios'

const NuevaUsuarioRestriccionTexto = () => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [show, setShow] = useState(false)
  const [showM, setShowM] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [color, setColor] = useState('danger')
  const [titulo, setTitulo] = useState('Error!')
  const [resultsUsuarios, setListUsuarios] = useState([])

  const [form, setValues] = useState({
    id_usuario: 0,
    texto: '',
  })

  useEffect(() => {
    let mounted = true
    getUsuarios(null, null, null, null, session.api_token).then((items) => {
      if (mounted) {
        setListUsuarios(items.users)
      }
    })
    return () => (mounted = false)
  }, [])

  const handleInput = (event) => {
    if (event.target.name == 'texto') {
      let valor = event.target.value
      let arrayValores = valor.split('|')
      setValues({
        ...form,
        ['texto']: arrayValores[0],
      })
    } else {
      setValues({
        ...form,
        [event.target.name]: event.target.value,
      })
    }
  }

  const handleSubmit = async (event) => {
    if (form.descripcion !== '') {
      event.preventDefault()
      const respuesta = await postCrudUsuarioRestriccionTexto(
        '',
        form.id_usuario,
        form.texto,
        '',
        session.id,
        session.api_token,
      )
      if (respuesta === 'OK') {
        history.push('/usuariorestricciontexto')
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
          <div className="float-left" style={{ marginBottom: '10px' }}>
            <Button variant="primary" size="sm" onClick={() => history.goBack()}>
              <FaArrowLeft />
              &nbsp;&nbsp;Regresar
            </Button>
          </div>
          <br />
          <br />
          <Alert show={show} variant={color} onClose={() => setShow(false)} dismissible>
            <Alert.Heading>{titulo}</Alert.Heading>
            <p>{mensaje}</p>
          </Alert>
          <CCard style={{ display: 'flex', alignItems: 'center' }}>
            <CCardBody style={{ width: '80%' }}>
              <CForm style={{ width: '100%' }}>
                <h1>Nueva restricción de texto por usuario</h1>
                <p className="text-medium-emphasis">Agrega un nuevo texto a empleado</p>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiUserCheck />
                  </CInputGroupText>
                  <CFormSelect name="id_usuario" onChange={handleInput}>
                    <option value="0">Seleccione un usuario.</option>
                    {resultsUsuarios.map((item, i) => {
                      if (item.eliminado == 0 && item.activo == 1) {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.nombre + ' ' + item.apellido + ' [' + item.nombre_usuario + ']'}
                          </option>
                        )
                      }
                    })}
                  </CFormSelect>
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiLayout />
                  </CInputGroupText>
                  <CFormControl
                    type="text"
                    placeholder="Texto"
                    name="texto"
                    onChange={handleInput}
                  />
                </CInputGroup>
                <CButton color="primary" onClick={handleSubmit}>
                  Agregar Texto
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CContainer>
      </div>
    )
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default NuevaUsuarioRestriccionTexto
