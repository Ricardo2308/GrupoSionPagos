import React, { useState, useEffect } from 'react'
import { useSession } from 'react-use-session'
import { Alert } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { useHistory, useLocation } from 'react-router-dom'
import { postCondicionGrupo } from '../../../../services/postCondicionGrupo'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { getGruposAutorizacion } from '../../../../services/getGruposAutorizacion'
import { FiAlertTriangle } from 'react-icons/fi'
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
  CFormCheck,
} from '@coreui/react'

const CondicionGrupo = () => {
  const history = useHistory()
  const location = useLocation()
  const { session } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [results, setList] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [opcion, setOpcion] = useState(0)
  const [titulo, setTitulo] = useState('Error!')
  const [color, setColor] = useState('danger')

  const [form, setValues] = useState({
    grupo_autorizacion: '',
  })

  useEffect(() => {
    let mounted = true
    getGruposAutorizacion(null, null).then((items) => {
      if (mounted) {
        setList(items.grupos)
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
    let result = ''
    event.preventDefault()
    var markedCheckbox = document.getElementsByName('grupo_autorizacion')
    for (var checkbox of markedCheckbox) {
      if (checkbox.checked) {
        result += checkbox.value + '|'
      }
    }
    const respuesta = await postCondicionGrupo('', location.id_condicion, result, '1', '', '')
    if (respuesta === 'OK') {
      history.push('/condiciones')
    } else if (respuesta === 'Error') {
      setShow(true)
      setTitulo('Error!')
      setMensaje('Error de conexión.')
    } else if (respuesta === 'Repetidos') {
      setShow(true)
      setTitulo('Aviso!')
      setColor('warning')
      setMensaje(
        'Los grupos seleccionados ya fueron elegidos para esta condición!' + ' Intente con otros.',
      )
    } else {
      console.log(respuesta)
    }
  }

  const handleOnIdle = (event) => {
    setShow(true)
    setOpcion(2)
    setMensaje('Ya estuvo mucho tiempo sin realizar ninguna acción. Desea continuar?')
    console.log('last active', getLastActiveTime())
  }

  const handleOnActive = (event) => {
    console.log('time remaining', getRemainingTime())
  }

  const handleOnAction = (event) => {}

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * parseInt(session == null ? 1 : session.limiteconexion),
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500,
  })

  if (session) {
    if (location.id_condicion) {
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
                  <h1>Asignación de Grupos de Autorización</h1>
                  <p className="text-medium-emphasis">
                    Asigne grupos de autorización a la condición
                  </p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FiAlertTriangle />
                    </CInputGroupText>
                    <CFormControl
                      type="text"
                      placeholder="Nombre"
                      name="nombre"
                      value={location.descripcion}
                      disabled={true}
                    />
                  </CInputGroup>
                  {results.map((item, i) => {
                    if (item.eliminado == 0 && item.activo == 1) {
                      return (
                        <CFormCheck
                          key={item.id_grupo}
                          value={item.id_grupo}
                          type="checkbox"
                          name="grupo_autorizacion"
                          label={item.identificador}
                          onChange={handleInput}
                        />
                      )
                    }
                  })}
                  <br />
                  <CButton color="primary" onClick={handleSubmit}>
                    Guardar Cambios
                  </CButton>
                </CForm>
              </CCardBody>
            </CCard>
          </CContainer>
        </div>
      )
    } else {
      history.push('/condiciones')
      return (
        <div className="sin-sesion">
          NO SE CARGÓ EL CÓDIGO DE CONDICIÓN. REGRESE A LA PANTALLA DE PAGOS.
        </div>
      )
    }
  } else {
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default CondicionGrupo
