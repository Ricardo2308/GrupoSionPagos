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
  CFormControl,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
} from '@coreui/react'
import { FiUsers, FiGrid, FiSettings } from 'react-icons/fi'
import { postGruposAutorizacion } from '../../../../services/postGruposAutorizacion'
import { getGruposAutorizacion } from '../../../../services/getGruposAutorizacion'
import '../../../../scss/estilos.scss'

const NuevoGrupo = () => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [color, setColor] = useState('danger')
  const [titulo, setTitulo] = useState('Error!')
  const [results, setList] = useState([])

  const [form, setValues] = useState({
    grupopadre: '0',
    descripcion: '',
    identificador: '',
  })

  useEffect(() => {
    let mounted = true
    getGruposAutorizacion(null, null).then((items) => {
      if (mounted) {
        setList(items.grupos)
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
    if (form.descripcion !== '' && form.identificador !== '') {
      event.preventDefault()
      const respuesta = await postGruposAutorizacion(
        '',
        form.grupopadre,
        form.identificador,
        form.descripcion,
        '',
        '3',
      )
      if (respuesta === 'OK') {
        history.push('/grupos/grupos')
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
                <h1>Creación de Grupo de Autorización</h1>
                <p className="text-medium-emphasis">Cree un nuevo grupo de autorización</p>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiGrid />
                  </CInputGroupText>
                  <CFormControl
                    type="text"
                    placeholder="Identificador"
                    name="identificador"
                    onChange={handleInput}
                  />
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiUsers />
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
                  <CFormSelect name="grupopadre" onChange={handleInput}>
                    <option>Seleccione un grupo superior. (Opcional)</option>
                    {results.map((item, i) => {
                      if (item.estado_eliminado !== '1' && item.estado_activo !== '0') {
                        return (
                          <option key={item.id_grupo} value={item.id_grupo}>
                            {item.identificador}
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

export default NuevoGrupo
