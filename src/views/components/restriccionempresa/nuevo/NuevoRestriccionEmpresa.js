import React, { useState, useEffect } from 'react'
import { useSession } from 'react-use-session'
import { Alert, Modal, Button } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { useHistory } from 'react-router-dom'
import { FiUserPlus, FiLayout } from 'react-icons/fi'
import { postCrudRestriccionEmpresa } from '../../../../services/postCrudRestriccionEmpresa'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { getEmpresaDisponible } from '../../../../services/getRestriccionEmpresa'
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

const NuevoRol = () => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [show, setShow] = useState(false)
  const [showM, setShowM] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [color, setColor] = useState('danger')
  const [titulo, setTitulo] = useState('Error!')

  const [form, setValues] = useState({
    empresa_codigo: '',
    empresa_nombre: '',
  })

  useEffect(() => {
    let mounted = true
    getEmpresaDisponible(session.api_token).then((items) => {
      if (mounted) {
        setList(items.restriccion_empresa)
      }
    })
    return () => (mounted = false)
  }, [])

  const handleInput = (event) => {
    if (event.target.name == 'empresa') {
      let valor = event.target.value
      let arrayValores = valor.split('|')
      setValues({
        ...form,
        ['empresa_codigo']: arrayValores[0],
        ['empresa_nombre']: arrayValores[1],
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
      const respuesta = await postCrudRestriccionEmpresa(
        '',
        form.empresa_codigo,
        form.empresa_nombre,
        '',
        session.id,
        session.api_token,
      )
      if (respuesta === 'OK') {
        history.push('/restriccionempresa')
      }
    } else {
      setShow(true)
      setTitulo('Error!')
      setColor('danger')
      setMensaje('No has ingresado ninguna descripción.')
    }
  }

  async function Cancelar(opcion) {
    if (opcion == 1) {
      setShowM(false)
    } else if (opcion == 2) {
      let idUsuario = 0
      if (session) {
        idUsuario = session.id
      }
      const respuesta = await postSesionUsuario(idUsuario, null, null, '2', session.api_token)
      if (respuesta === 'OK') {
        clear()
        history.push('/')
      }
    }
  }

  if (session) {
    return (
      <div style={{ flexDirection: 'row' }}>
        <CContainer>
          <Modal responsive variant="primary" show={showM} onHide={() => Cancelar(2)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Confirmación</Modal.Title>
            </Modal.Header>
            <Modal.Body>{mensaje}</Modal.Body>
            <Modal.Footer>
              <CButton color="secondary" onClick={() => Cancelar(2)}>
                Cancelar
              </CButton>
              <CButton color="primary" onClick={() => Cancelar(1)}>
                Aceptar
              </CButton>
            </Modal.Footer>
          </Modal>
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
                <h1>Nueva restricción de empresa</h1>
                <p className="text-medium-emphasis">
                  Agrega una nueva empresa a la lista de restricción
                </p>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiLayout />
                  </CInputGroupText>
                  <CFormSelect placeholder="Empresa" name="empresa" onChange={handleInput}>
                    <option>Seleccione una empresa</option>
                    {results.map((item, i) => {
                      return (
                        <option
                          key={item.enmpresa_codigo}
                          value={item.empresa_codigo + '|' + item.empresa_nombre}
                        >
                          {item.empresa_nombre}
                        </option>
                      )
                    })}
                  </CFormSelect>
                </CInputGroup>
                <CButton color="primary" onClick={handleSubmit}>
                  Agregar empresa
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

export default NuevoRol
