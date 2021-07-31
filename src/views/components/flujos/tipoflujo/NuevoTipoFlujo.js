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
import { getEstadosFlujo } from '../../../../services/getEstadosFlujo'
import { postTipoFlujo } from '../../../../services/postTipoFlujo'
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
    descripcion: '',
    estado_inicial: '0',
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
    if (form.descripcion !== '') {
      event.preventDefault()
      const respuesta = await postTipoFlujo('', form.descripcion, form.estado_inicial, '', '3')
      if (respuesta === 'OK') {
        history.push('/tipoflujo/tipos')
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
                <h1>Creación de Tipo de Flujo</h1>
                <p className="text-medium-emphasis">Cree un nuevo tipo de flujo</p>
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
                  <CFormSelect name="estado_inicial" onChange={handleInput}>
                    <option>Seleccione estado inicial. (Opcional)</option>
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
                  Crear Grupo
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
