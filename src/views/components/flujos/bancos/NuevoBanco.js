import React, { useState, useEffect } from 'react'
import { useSession } from 'react-use-session'
import { Alert, Modal, Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useIdleTimer } from 'react-idle-timer'
import { postCrudBancos } from '../../../../services/postCrudBancos'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { getPaises } from '../../../../services/getPaises'
import { FiFlag } from 'react-icons/fi'
import { GrLocation } from 'react-icons/gr'
import { RiBankLine, RiBarcodeFill } from 'react-icons/ri'
import '../../../../scss/estilos.scss'
import {
  CButton,
  CCard,
  CCardBody,
  CContainer,
  CForm,
  CFormSelect,
  CFormControl,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import { FaArrowLeft } from 'react-icons/fa'

const NuevoBanco = (props) => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [showM, setShowM] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [results, setList] = useState([])

  const [form, setValues] = useState({
    nombre: '',
    direccion: '',
    pais: '',
    codigoTransferencia: '',
    codigoSAP: '',
  })

  useEffect(() => {
    let mounted = true
    getPaises(null, null).then((items) => {
      if (mounted) {
        setList(items.paises)
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
    if (
      form.nombre !== '' &&
      form.direccion !== '' &&
      form.pais !== '' &&
      form.codigoTransferencia !== ''
    ) {
      event.preventDefault()
      const respuesta = await postCrudBancos(
        '',
        form.nombre,
        form.direccion,
        form.codigoTransferencia,
        form.codigoSAP,
        form.pais,
        '',
        '',
        session.id,
      )
      if (respuesta === 'OK') {
        history.push('/bancos')
      } else if (respuesta === 'Repetido') {
        setShow(true)
        setMensaje('Este banco según el código de transferencia ingresado ya existe.')
      }
    } else {
      setShow(true)
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
          <Alert show={show} variant="danger" onClose={() => setShow(false)} dismissible>
            <Alert.Heading>Error!</Alert.Heading>
            <p>{mensaje}</p>
          </Alert>
          <CCard style={{ display: 'flex', alignItems: 'center' }}>
            <CCardBody style={{ width: '80%' }}>
              <CForm style={{ width: '100%' }}>
                <h1>Creación de Banco</h1>
                <p className="text-medium-emphasis">Registre un nuevo banco</p>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <RiBankLine />
                  </CInputGroupText>
                  <CFormControl
                    type="text"
                    placeholder="Nombre"
                    name="nombre"
                    onChange={handleInput}
                  />
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <GrLocation />
                  </CInputGroupText>
                  <CFormControl
                    type="text"
                    placeholder="Dirección"
                    name="direccion"
                    onChange={handleInput}
                  />
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <RiBarcodeFill />
                  </CInputGroupText>
                  <CFormControl
                    type="text"
                    placeholder="Código Transferencia"
                    name="codigoTransferencia"
                    onChange={handleInput}
                  />
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <RiBarcodeFill />
                  </CInputGroupText>
                  <CFormControl
                    type="text"
                    placeholder="Código SAP"
                    name="codigoSAP"
                    onChange={handleInput}
                  />
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiFlag />
                  </CInputGroupText>
                  <CFormSelect name="pais" onChange={handleInput}>
                    <option>Seleccione país. (Opcional)</option>
                    {results.map((item, i) => {
                      return (
                        <option key={item.IdPais} value={item.IdPais}>
                          {item.Nombre}
                        </option>
                      )
                    })}
                  </CFormSelect>
                </CInputGroup>
                <CButton color="primary" onClick={handleSubmit}>
                  Crear Banco
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

export default NuevoBanco
