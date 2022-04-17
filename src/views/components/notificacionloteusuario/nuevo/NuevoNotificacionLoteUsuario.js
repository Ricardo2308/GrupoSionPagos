import React, { useState, useEffect } from 'react'
import { useSession } from 'react-use-session'
import { Alert, Modal, Button } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { useHistory, useLocation } from 'react-router-dom'
import { postCrudNotificacionLoteUsuario } from '../../../../services/postCrudNotificacionLoteUsuario'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { getPermisos } from '../../../../services/getPermisos'
import { FiUserPlus } from 'react-icons/fi'
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
  CFormSelect,
} from '@coreui/react'
import { FaArrowLeft } from 'react-icons/fa'
import { getUsuarios } from '../../../../services/getUsuarios'
import { getNotificacionLoteUsuario } from '../../../../services/getNotificacionLoteUsuario'

const NuevoNotificacionLoteUsuario = () => {
  const history = useHistory()
  const location = useLocation()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [showM, setShowM] = useState(false)
  const [results, setList] = useState([])
  const [resultsUsuarios, setListUsuarios] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [titulo, setTitulo] = useState('Error!')
  const [color, setColor] = useState('danger')
  const [form, setValues] = useState({
    id_usuario: 0,
  })
  const [showInternas, setShowInternas] = useState(true)
  const [showInternasPDF, setShowInternasPDF] = useState(true)
  const [showInternasExcel, setShowInternasExcel] = useState(true)
  const [showBancaria, setShowBancaria] = useState(true)
  const [showBancariaPDF, setShowBancariaPDF] = useState(true)
  const [showBancariaExcel, setShowBancariaExcel] = useState(true)
  const [showTransferencia, setShowTransferencia] = useState(true)
  const [showTransferenciaPDF, setShowTransferenciaPDF] = useState(true)
  const [showTransferenciaExcel, setShowTransferenciaExcel] = useState(true)

  useEffect(() => {
    let mounted = true
    getUsuarios(null, null, null, null).then((items) => {
      if (mounted) {
        setListUsuarios(items.users)
      }
    })
    getPermisos(null, null).then((items) => {
      if (mounted) {
        setList(items.permisos)
      }
    })
    return () => (mounted = false)
  }, [])

  async function SeleccionUsuario(event) {
    setShowInternas(true)
    setShowInternasPDF(true)
    setShowInternasExcel(true)
    setShowBancaria(true)
    setShowBancariaPDF(true)
    setShowBancariaExcel(true)
    setShowTransferencia(true)
    setShowTransferenciaPDF(true)
    setShowTransferenciaExcel(true)
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    })
    getNotificacionLoteUsuario(event.target.value).then((items) => {
      let contadorBan = 0
      let contadorTra = 0
      let contadorInt = 0
      for (let item in items.UsuarioNotificacionTransaccion) {
        if (items.UsuarioNotificacionTransaccion[item].TipoTransaccion == 'BANCARIO') {
          if (items.UsuarioNotificacionTransaccion[item].id_tipodocumentolote == 1) {
            setShowBancariaPDF(false)
            contadorBan++
          }
          if (items.UsuarioNotificacionTransaccion[item].id_tipodocumentolote == 2) {
            setShowBancariaExcel(false)
            contadorBan++
          }
        }
        if (items.UsuarioNotificacionTransaccion[item].TipoTransaccion == 'TRANSFERENCIA') {
          if (items.UsuarioNotificacionTransaccion[item].id_tipodocumentolote == 1) {
            setShowTransferenciaPDF(false)
            contadorTra++
          }
          if (items.UsuarioNotificacionTransaccion[item].id_tipodocumentolote == 2) {
            setShowTransferenciaExcel(false)
            contadorTra++
          }
        }
        if (items.UsuarioNotificacionTransaccion[item].TipoTransaccion == 'INTERNA') {
          if (items.UsuarioNotificacionTransaccion[item].id_tipodocumentolote == 1) {
            setShowInternasPDF(false)
            contadorInt++
          }
          if (items.UsuarioNotificacionTransaccion[item].id_tipodocumentolote == 2) {
            setShowInternasExcel(false)
            contadorInt++
          }
        }
      }
      if (contadorBan == 2) {
        setShowBancaria(false)
      }
      if (contadorTra == 2) {
        setShowTransferencia(false)
      }
      if (contadorInt == 2) {
        setShowInternas(false)
      }
    })
  }

  const handleSubmit = async (event) => {
    let result = ''
    let resultBanc = ''
    let resultTran = ''
    let resultInte = ''
    event.preventDefault()
    if (showBancaria) {
      resultBanc = 'BANCARIO'
      var markedCheckbox = document.getElementsByName('DocumentoBancaria')
      for (var checkbox of markedCheckbox) {
        if (checkbox.checked) {
          resultBanc += ',' + checkbox.value
        }
      }
    }
    if (showTransferencia) {
      resultTran = 'TRANSFERENCIA'
      var markedCheckbox = document.getElementsByName('DocumentoTransferencia')
      for (var checkbox of markedCheckbox) {
        if (checkbox.checked) {
          resultTran += ',' + checkbox.value
        }
      }
    }
    if (showInternas) {
      resultInte = 'INTERNA'
      var markedCheckbox = document.getElementsByName('DocumentoInterna')
      for (var checkbox of markedCheckbox) {
        if (checkbox.checked) {
          resultInte += ',' + checkbox.value
        }
      }
    }
    if (resultBanc != '') {
      if (result == '') {
        result += resultBanc
      } else {
        result += '|' + resultBanc
      }
    }
    if (resultTran != '') {
      if (result == '') {
        result += resultTran
      } else {
        result += '|' + resultTran
      }
    }
    if (resultInte != '') {
      if (result == '') {
        result += resultInte
      } else {
        result += '|' + resultInte
      }
    }
    if (result !== '') {
      const respuesta = await postCrudNotificacionLoteUsuario(
        '',
        form.id_usuario,
        '',
        '',
        session.id,
        result,
      )
      if (respuesta === 'OK') {
        history.push('/notificacionloteusuario')
      } else if (respuesta === 'Error') {
        setShow(true)
        setTitulo('Error!')
        setMensaje('Error de conexión.')
      } else if (respuesta === 'Repetidos') {
        setShow(true)
        setTitulo('Aviso!')
        setColor('warning')
        setMensaje(' Intente de nuevo.')
      }
    } else {
      setShow(true)
      setTitulo('Error!')
      setColor('danger')
      setMensaje('No has seleccionado ninguna opción.')
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
      const respuesta = await postSesionUsuario(idUsuario, null, null, '2')
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
                <h1>Agregar configuración de notificación</h1>
                <p className="text-medium-emphasis">
                  Agregará a un usuario la configuración para recibir documentos de lotes
                </p>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiUserPlus />
                  </CInputGroupText>
                  <CFormSelect name="id_usuario" onChange={SeleccionUsuario}>
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
                <hr />
                <div className={!showBancaria ? 'd-none' : ''}>
                  <h3>BANCARIA</h3>
                  <CFormCheck
                    className={!showBancariaPDF ? 'd-none' : ''}
                    value="1"
                    type="checkbox"
                    name="DocumentoBancaria"
                    label="PDF"
                  />
                  <CFormCheck
                    className={!showBancariaExcel ? 'd-none' : ''}
                    value="2"
                    type="checkbox"
                    name="DocumentoBancaria"
                    label="Excel"
                  />
                  <hr />
                </div>
                <div className={!showTransferencia ? 'd-none' : ''}>
                  <h3>TRANSFERENCIA</h3>
                  <CFormCheck
                    className={!showTransferenciaPDF ? 'd-none' : ''}
                    value="1"
                    type="checkbox"
                    name="DocumentoTransferencia"
                    label="PDF"
                  />
                  <CFormCheck
                    className={!showTransferenciaExcel ? 'd-none' : ''}
                    value="2"
                    type="checkbox"
                    name="DocumentoTransferencia"
                    label="Excel"
                  />
                  <hr />
                </div>
                <div className={!showInternas ? 'd-none' : ''}>
                  <h3>INTERNA</h3>
                  <CFormCheck
                    className={!showInternasPDF ? 'd-none' : ''}
                    value="1"
                    type="checkbox"
                    name="DocumentoInterna"
                    label="PDF"
                  />
                  <CFormCheck
                    className={!showInternasExcel ? 'd-none' : ''}
                    value="2"
                    type="checkbox"
                    name="DocumentoInterna"
                    label="Excel"
                  />
                  <hr />
                </div>
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
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default NuevoNotificacionLoteUsuario
