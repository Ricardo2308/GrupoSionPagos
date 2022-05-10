import React, { useState } from 'react'
import { useSession } from 'react-use-session'
import { Alert, Modal, Button } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { useHistory } from 'react-router-dom'
import { FiUserPlus, FiLayout } from 'react-icons/fi'
import { postCrudRoles } from '../../../../services/postCrudRoles'
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

const NuevoRol = () => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [showM, setShowM] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [color, setColor] = useState('danger')
  const [titulo, setTitulo] = useState('Error!')

  const [form, setValues] = useState({
    descripcion: '',
    objeto: '',
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
      const respuesta = await postCrudRoles(
        '',
        form.descripcion,
        form.objeto,
        '',
        '',
        session.id,
        session.api_token,
      )
      if (respuesta === 'OK') {
        history.push('/roles')
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
                <h1>Creación de Rol</h1>
                <p className="text-medium-emphasis">Cree un nuevo rol</p>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiUserPlus />
                  </CInputGroupText>
                  <textarea
                    placeholder="Descripción"
                    className="form-control"
                    rows="2"
                    onChange={handleInput}
                    name="descripcion"
                  ></textarea>
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiLayout />
                  </CInputGroupText>
                  <CFormSelect placeholder="Objeto" name="objeto" onChange={handleInput}>
                    <option value="Modulo Perfiles">Modulo Perfiles</option>
                    <option value="Modulo Roles">Modulo Roles</option>
                    <option value="Modulo Permisos">Modulo Permisos</option>
                    <option value="Modulo Politicas">Modulo Politicas</option>
                    <option value="Modulo Condiciones">Modulo Condiciones</option>
                    <option value="Modulo Grupos Autorizacion">Modulo Grupos Autorizacion</option>
                    <option value="Modulo Estados Pago">Modulo Estados Pago</option>
                    <option value="Modulo Tipos Flujo">Modulo Tipos Flujo</option>
                    <option value="Modulo Archivos Pago">Modulo Archivos Pago</option>
                    <option value="Modulo Bancos">Modulo Bancos</option>
                    <option value="Modulo Monedas">Modulo Monedas</option>
                    <option value="Modulo Cuentas">Modulo Cuentas</option>
                    <option value="Modulo Autorizacion Pagos">Modulo Autorizacion Pagos</option>
                    <option value="Modulo Compensacion Pagos">Modulo Compensacion Pagos</option>
                    <option value="Modulo Autorizacion">Modulo Autorizacion</option>
                    <option value="Modulo Conectados">Modulo Conectados</option>
                    <option value="Modulo Usuarios">Modulo Usuarios</option>
                    <option value="Seccion Reportes">Seccion Reportes</option>
                    <option value="Modulo RestriccionEmpresa">Modulo RestriccionEmpresa</option>
                    <option value="Modulo CuentaGrupoAutorizacion">
                      Modulo CuentaGrupoAutorizacion
                    </option>
                    <option value="Modulo DescargaArchivos">Modulo DescargaArchivos</option>
                    <option value="Modulo NotificacionLote">Modulo NotificacionLote</option>
                    <option value="Modulo Bitacora">Modulo Bitacora</option>
                    <option value="Modulo PrioridadChat">Modulo PrioridadChat</option>
                  </CFormSelect>
                </CInputGroup>
                <CButton color="primary" onClick={handleSubmit}>
                  Crear Rol
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
