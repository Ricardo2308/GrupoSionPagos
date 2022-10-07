import React, { useState, useEffect } from 'react'
import { useSession } from 'react-use-session'
import { Alert, Modal, Button } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { useHistory, useLocation } from 'react-router-dom'
import { postCrudBancos } from '../../../../services/postCrudBancos'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { getPaises } from '../../../../services/getPaises'
import { FiSettings, FiFlag } from 'react-icons/fi'
import { GrLocation } from 'react-icons/gr'
import { RiBankLine, RiBarcodeFill } from 'react-icons/ri'
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

const EditarBancos = (props) => {
  const history = useHistory()
  const location = useLocation()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [showM, setShowM] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [results, setList] = useState([])

  const [form, setValues] = useState({
    nombre: location.nombre,
    direccion: location.direccion,
    estado: location.estado,
    pais: location.pais,
    codigoTransferencia: location.codigoTransferencia,
    codigoSAP: location.codigoSAP,
  })

  useEffect(() => {
    let mounted = true
    getPaises(null, null, session.api_token).then((items) => {
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
      form.codigoTransferencia !== '' &&
      form.codigoSAP !== ''
    ) {
      event.preventDefault()
      const respuesta = await postCrudBancos(
        location.id_banco,
        form.nombre,
        form.direccion,
        form.codigoTransferencia,
        form.codigoSAP,
        form.pais,
        form.estado,
        '1',
        session.id,
        session.api_token,
      )
      if (respuesta === 'OK') {
        history.push('/bancos')
      }
    } else {
      setShow(true)
      setMensaje('No has llenado todos los campos.')
    }
  }

  if (session) {
    if (location.id_banco) {
      return (
        <div style={{ flexDirection: 'row' }}>
          <CContainer>
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
                  <h1>Modificación de Banco</h1>
                  <p className="text-medium-emphasis">Modifique la información del banco</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <RiBankLine />
                    </CInputGroupText>
                    <CFormControl
                      type="text"
                      placeholder="Nombre"
                      name="nombre"
                      defaultValue={location.nombre}
                      onChange={handleInput}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <GrLocation />
                    </CInputGroupText>
                    <CFormControl
                      type="text"
                      placeholder="Direccion"
                      name="direccion"
                      defaultValue={location.direccion}
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
                      defaultValue={location.codigoTransferencia}
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
                      defaultValue={location.codigoSAP}
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
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FiSettings />
                    </CInputGroupText>
                    <CFormSelect name="estado" onChange={handleInput}>
                      <option>Seleccione estado. (Opcional)</option>
                      <option value="1">Activo</option>
                      <option value="0">Inactivo</option>
                    </CFormSelect>
                  </CInputGroup>
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
      history.push('/bancos')
      return (
        <div className="sin-sesion">
          NO SE CARGÓ EL CÓDIGO DEL USUARIO. REGRESE A LA PANTALLA DE USUARIOS.
        </div>
      )
    }
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default EditarBancos
