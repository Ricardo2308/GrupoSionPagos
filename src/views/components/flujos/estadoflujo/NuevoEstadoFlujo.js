import React, { useState, useEffect } from 'react'
import { useSession } from 'react-use-session'
import { Alert } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CContainer,
  CForm,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
} from '@coreui/react'
import { FiGrid, FiSettings } from 'react-icons/fi'
import { postEstadoFlujo } from '../../../../services/postEstadoFlujo'
import { getEstadosFlujo } from '../../../../services/getEstadosFlujo'
import '../../../../scss/estilos.scss'

const NuevoEstadoFlujo = () => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [color, setColor] = useState('danger')
  const [titulo, setTitulo] = useState('Error!')
  const [results, setList] = useState([])

  const [form, setValues] = useState({
    flujopadre: '0',
    descripcion: '',
  })

  useEffect(() => {
    let mounted = true
    getEstadosFlujo(null, null).then((items) => {
      if (mounted) {
        setList(items.estados)
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
    if (form.descripcion !== '') {
      event.preventDefault()
      const respuesta = await postEstadoFlujo('', form.flujopadre, form.descripcion, '', '3')
      if (respuesta === 'OK') {
        history.push('/estadoflujo/estados')
      }
    } else {
      setShow(true)
      setTitulo('Error!')
      setColor('danger')
      setMensaje('No has llenado todos los campos.')
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
              <CForm style={{ width: '100%' }}>
                <h1>Creación de Estado de Flujo</h1>
                <p className="text-medium-emphasis">Cree un nuevo estado de flujo</p>
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
                  ></textarea>
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiSettings />
                  </CInputGroupText>
                  <CFormSelect name="flujopadre" onChange={handleInput}>
                    <option>Seleccione un estado superior. (Opcional)</option>
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
                <CButton color="primary" block onClick={handleSubmit}>
                  Crear Estado
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

export default NuevoEstadoFlujo
