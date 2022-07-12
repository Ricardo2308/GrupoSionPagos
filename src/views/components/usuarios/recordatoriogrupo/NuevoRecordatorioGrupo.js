import React, { useState, useEffect } from 'react'
import { useSession } from 'react-use-session'
import { Alert, Modal, Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useIdleTimer } from 'react-idle-timer'
import { FiUserCheck, FiUserPlus } from 'react-icons/fi'
import { postUsuarioRecordatorioGrupo } from '../../../../services/postUsuarioRecordatorioGrupo'
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
import { getUsuarioGrupo } from '../../../../services/getUsuarioGrupo'
import { getUsuariosPorGrupoSegunUsuario } from '../../../../services/getUsuariosPorGrupoSegunUsuario'

const NuevoRecordatorioGrupo = () => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [showM, setShowM] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [color, setColor] = useState('danger')
  const [titulo, setTitulo] = useState('Error!')
  const [resultsUsuarios, setListUsuarios] = useState([])
  const [MostrarReceptor, setMostrarReceptor] = useState(false)
  const [MostrarGrupos, setMostrarGrupos] = useState(false)
  const [listaGrupos, setListGrupos] = useState([])
  const [resultsUsuariosReceptor, setUsuariosReceptor] = useState([])

  const [form, setValues] = useState({
    id_usuario_emisor: '',
    id_usuario_receptor: '',
    id_grupoautorizacion: '',
  })

  useEffect(() => {
    let mounted = true
    let objeto = 'Modulo RecordatorioGrupo'
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getUsuarios(null, null, null, null, session.api_token).then((items) => {
      if (mounted) {
        setListUsuarios(items.users)
      }
    })
    return () => (mounted = false)
  }, [])

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    })
    if (event.target.name == 'id_usuario_emisor') {
      CargarGrupos(event.target.value)
    }
    if (event.target.name == 'id_grupoautorizacion') {
      CargarReceptores(event.target.value)
    }
  }

  async function CargarGrupos(id) {
    await getUsuarioGrupo(id, null, session.api_token).then((items) => {
      setListGrupos(items.detalle)
      setMostrarGrupos(true)
    })
  }

  async function CargarReceptores(id) {
    await getUsuariosPorGrupoSegunUsuario(form.id_usuario_emisor, id, session.api_token).then(
      (items) => {
        setUsuariosReceptor(items.usuarios)
        setMostrarReceptor(true)
      },
    )
  }

  const handleSubmit = async (event) => {
    if (
      form.id_usuario_emisor !== '' &&
      form.id_usuario_receptor !== '' &&
      form.id_grupoautorizacion !== '' &&
      form.id_usuario_emisor != '0' &&
      form.id_usuario_receptor != '0' &&
      form.id_grupoautorizacion != '0'
    ) {
      event.preventDefault()
      const respuesta = await postUsuarioRecordatorioGrupo(
        '',
        form.id_usuario_emisor,
        form.id_usuario_receptor,
        form.id_grupoautorizacion,
        '',
        '',
        session.id,
        session.api_token,
      )
      if (respuesta === 'OK') {
        history.push('/recordatoriogrupo')
      }
    } else {
      setShow(true)
      setTitulo('Error!')
      setColor('danger')
      setMensaje('No has llenado todos los campos.')
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
                <h1>Agreguar usuario para recordatorio de grupo</h1>
                <p className="text-medium-emphasis">
                  Cree una nuevo registro para enviar recordatorio a usuario por grupo
                </p>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiUserCheck />
                  </CInputGroupText>
                  <CFormSelect name="id_usuario_emisor" onChange={handleInput}>
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
                <CInputGroup className={!MostrarGrupos ? 'd-none mb-3' : 'mb-3'}>
                  <CInputGroupText>
                    <FiUserPlus />
                  </CInputGroupText>
                  <CFormSelect name="id_grupoautorizacion" onChange={handleInput}>
                    <option value="0">Seleccione un grupo de autorización</option>
                    {listaGrupos.map((item, i) => {
                      if (item.eliminado == 0 && item.activo == 1) {
                        return (
                          <option key={item.id_grupoautorizacion} value={item.id_grupoautorizacion}>
                            {'[' + item.identificador + '] ' + item.descripcion}
                          </option>
                        )
                      }
                    })}
                  </CFormSelect>
                </CInputGroup>
                <CInputGroup className={!MostrarReceptor ? 'd-none mb-3' : 'mb-3'}>
                  <CInputGroupText>
                    <FiUserPlus />
                  </CInputGroupText>
                  <CFormSelect name="id_usuario_receptor" onChange={handleInput}>
                    <option value="0">Seleccione usuario receptor</option>
                    {resultsUsuariosReceptor.map((item, i) => {
                      return (
                        <option key={item.id_usuario} value={item.id_usuario}>
                          {item.nombre + ' ' + item.apellido + ' [' + item.usuario + ']'}
                        </option>
                      )
                    })}
                  </CFormSelect>
                </CInputGroup>
                <CButton color="primary" onClick={handleSubmit}>
                  Crear Registro
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

export default NuevoRecordatorioGrupo
