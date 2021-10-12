import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import { Alert } from 'react-bootstrap'
import DatePicker, { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
import 'react-datepicker/dist/react-datepicker.css'
import { useSession } from 'react-use-session'
import { postUsuarioAutorizacion } from '../../../../services/postUsuarioAutorizacion'
import { getUsuarios } from '../../../../services/getUsuarios'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import '../../../../scss/estilos.scss'
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

const UsuarioGrupo = () => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [color, setColor] = useState('danger')
  const [titulo, setTitulo] = useState('Error!')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])
  registerLocale('es', es)

  const [form, setValues] = useState({
    aprobador: session.id,
    temporal: '',
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
    getPerfilUsuario(session.id, '2').then((items) => {
      if (mounted) {
        setPermisos(items.detalle)
      }
    })
    return () => (mounted = false)
  }, [])

  function ExistePermiso(objeto) {
    let result = 0
    for (let item of permisos) {
      if (objeto === item.objeto) {
        result = 1
      }
    }
    return result
  }

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    if (form.aprobador !== '' && form.temporal !== '' && fechainicio && fechafinal) {
      if (fechafinal > fechainicio) {
        event.preventDefault()
        const respuesta = await postUsuarioAutorizacion(
          '',
          form.aprobador,
          form.temporal,
          fechainicio,
          fechafinal,
          '',
          '',
        )
        if (respuesta === 'OK') {
          history.push('/autorizacion')
        } else if (respuesta === 'Existe') {
          setShow(true)
          setTitulo('Fechas existentes!')
          setColor('danger')
          setMensaje(
            'Las fechas inicial o final coinciden con una autorizacion ya programada.' +
              ' Intente con otras fechas.',
          )
        }
      } else {
        setShow(true)
        setTitulo('Error!')
        setColor('danger')
        setMensaje('La fecha final debe ser después de la inicial.')
      }
    } else {
      setShow(true)
      setTitulo('Error!')
      setColor('danger')
      setMensaje('No has llenado todos los campos.')
    }
  }

  if (session) {
    let deshabilitar = false
    if (ExistePermiso('Modulo Autorizacion') == 0) {
      deshabilitar = true
    }
    return (
      <div style={{ flexDirection: 'row' }}>
        <CContainer>
          <Alert show={show} variant={color} onClose={() => setShow(false)} dismissible>
            <Alert.Heading>{titulo}</Alert.Heading>
            <p>{mensaje}</p>
          </Alert>
          <CCard className="autorizacion-card">
            <CCardBody style={{ width: '80%' }}>
              <CForm className="autorizacion-form">
                <h1>Asignación de Usuario Temporal</h1>
                <p className="text-medium-emphasis autorizacion-form">
                  Seleccione a un nuevo encargado
                </p>
                <CInputGroup className="mb-3 autorizacion-form">
                  <CInputGroupText style={{ width: '22%' }}>Usuario Aprobador</CInputGroupText>
                  <CFormSelect name="aprobador" onChange={handleInput} disabled={deshabilitar}>
                    <option selected={true} value={session.id}>
                      {session.name}
                    </option>
                    {results.map((item, i) => {
                      if (item.eliminado == 0 && item.activo == 1) {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.nombre} {item.apellido}
                          </option>
                        )
                      }
                    })}
                  </CFormSelect>
                </CInputGroup>
                <CInputGroup className="mb-3 autorizacion-form">
                  <CInputGroupText style={{ width: '22%' }}>Usuario Temporal</CInputGroupText>
                  <CFormSelect name="temporal" onChange={handleInput}>
                    <option>Seleccione usuario temporal.</option>
                    {results.map((item, i) => {
                      if (item.eliminado == 0 && item.activo == 1 && item.id !== session.id) {
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
                  <div className="autorizacion-fecha">
                    <div style={{ width: '100%', alignItems: 'center' }}>
                      <CFormLabel style={{ marginLeft: '40px', marginRight: '15px' }}>
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
                      <CFormLabel style={{ marginLeft: '40px', marginRight: '15px' }}>
                        Fecha de Fin
                      </CFormLabel>
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
                <CButton color="primary" onClick={handleSubmit} style={{ marginBottom: '20px' }}>
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
