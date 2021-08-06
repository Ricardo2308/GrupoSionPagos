import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import { Alert } from 'react-bootstrap'
import DatePicker, { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
import 'react-datepicker/dist/react-datepicker.css'
import { useSession } from 'react-use-session'
import { postUsuarioAutorizacion } from '../../../../services/postUsuarioAutorizacion'
import { getUsuarios } from '../../../../services/getUsuarios'
import {
  CButton,
  CCard,
  CCardBody,
  CContainer,
  CForm,
  CFormSelect,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import { FiSettings } from 'react-icons/fi'
import '../../../../scss/estilos.scss'

const UsuarioGrupo = () => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [color, setColor] = useState('danger')
  const [titulo, setTitulo] = useState('Error!')
  const [results, setList] = useState([])
  registerLocale('es', es)

  const [form, setValues] = useState({
    usuario: '',
  })

  const [fechainicio, setFechaInicio] = useState(new Date())
  const [fechafinal, setFechaFinal] = useState(new Date())

  useEffect(() => {
    let mounted = true
    getUsuarios(null, null, null, null).then((items) => {
      if (mounted) {
        setList(items.users)
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
    event.preventDefault()
    const respuesta = await postUsuarioAutorizacion(
      '',
      session.id,
      form.usuario,
      fechainicio,
      fechafinal,
      '1',
      '',
    )
    if (form.usuario !== '' && fechainicio && fechafinal) {
      if (respuesta === 'OK') {
        history.push('/autorizacion/listado')
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
              <CForm style={{ width: '100%' }} onSubmit={handleSubmit}>
                <h1>Asignación de Usurio Temporal</h1>
                <p className="text-medium-emphasis">Seleccione a un nuevo encargado</p>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiSettings />
                  </CInputGroupText>
                  <CFormSelect name="usuario" onChange={handleInput}>
                    <option>Seleccione usuario temporal.</option>
                    {results.map((item, i) => {
                      if (item.eliminado !== '1' && item.activo !== '0' && item.id !== session.id) {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.nombre} {item.apellido}
                          </option>
                        )
                      }
                    })}
                  </CFormSelect>
                </CInputGroup>
                <div style={{ width: '100%', alignItems: 'center' }}>
                  <div style={{ flexDirection: 'row', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '50%', alignItems: 'center' }}>
                      <CFormLabel style={{ marginLeft: '50px', marginRight: '15px' }}>
                        Fecha de Inicio
                      </CFormLabel>
                      <DatePicker
                        locale="es"
                        selected={fechainicio}
                        onChange={(date) => setFechaInicio(date)}
                        dateFormat="dd-MMMM-yyyy"
                      />
                    </div>
                    <div style={{ width: '50%', alignItems: 'center' }}>
                      <CFormLabel style={{ marginRight: '15px' }}>Fecha de Fin </CFormLabel>
                      <DatePicker
                        locale="es"
                        selected={fechafinal}
                        onChange={(date) => setFechaFinal(date)}
                        dateFormat="dd-MMMM-yyyy"
                      />
                    </div>
                  </div>
                </div>
                <br />
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
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default UsuarioGrupo
