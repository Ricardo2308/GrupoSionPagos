import React, { useState, useEffect } from 'react'
import { useSession } from 'react-use-session'
import { Alert, Modal } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useIdleTimer } from 'react-idle-timer'
import { postCrudCuentas } from '../../../../services/postCrudCuentas'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { getBancos } from '../../../../services/getBancos'
import { getMonedas } from '../../../../services/getMonedas'
import { FiCreditCard } from 'react-icons/fi'
import { RiBankLine } from 'react-icons/ri'
import { FaRegBuilding } from 'react-icons/fa'
import { MdAttachMoney } from 'react-icons/md'
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

const NuevoBanco = (props) => {
  const history = useHistory()
  const { session, clear } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [showM, setShowM] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [results, setList] = useState([])
  const [results1, setList1] = useState([])

  useEffect(() => {
    let mounted = true
    getBancos(null, null).then((items) => {
      if (mounted) {
        setList(items.bancos)
      }
    })
    getMonedas(null, null).then((items) => {
      if (mounted) {
        setList1(items.monedas)
      }
    })
    return () => (mounted = false)
  }, [])

  const [form, setValues] = useState({
    numero_cuenta: '',
    nombre: '',
    id_empresa: '',
    id_banco: '',
    id_moneda: '',
    codigo_ach: '',
  })

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    if (
      form.numero_cuenta !== '' &&
      form.nombre !== '' &&
      form.id_empresa !== '' &&
      form.id_banco !== '' &&
      form.id_moneda !== '' &&
      form.codigo_ach !== ''
    ) {
      event.preventDefault()
      const respuesta = await postCrudCuentas(
        '',
        form.numero_cuenta,
        form.nombre,
        form.id_empresa,
        form.id_banco,
        form.id_moneda,
        form.codigo_ach,
        '',
      )
      if (respuesta === 'OK') {
        history.push('/cuentas')
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

  const handleOnIdle = (event) => {
    setShowM(true)
    setMensaje(
      'Ya estuvo mucho tiempo sin realizar ninguna acción. Si desea continuar presione aceptar.',
    )
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
          <Alert show={show} variant="danger" onClose={() => setShow(false)} dismissible>
            <Alert.Heading>Error!</Alert.Heading>
            <p>{mensaje}</p>
          </Alert>
          <CCard style={{ display: 'flex', alignItems: 'center' }}>
            <CCardBody style={{ width: '80%' }}>
              <CForm style={{ width: '100%' }}>
                <h1>Creación de Cuenta</h1>
                <p className="text-medium-emphasis">Cree una nueva cuenta bancaria</p>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiCreditCard />
                  </CInputGroupText>
                  <CFormControl
                    type="text"
                    placeholder="Nombre Cuenta"
                    name="numero_cuenta"
                    onChange={handleInput}
                  />
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiCreditCard />
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
                    <FaRegBuilding />
                  </CInputGroupText>
                  <CFormControl
                    type="text"
                    placeholder="Código Empresa"
                    name="id_empresa"
                    onChange={handleInput}
                  />
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <RiBankLine />
                  </CInputGroupText>
                  <CFormSelect name="id_banco" onChange={handleInput}>
                    <option>Seleccione un banco. (Obligatorio)</option>
                    {results.map((item, i) => {
                      if (item.eliminado == 0 && item.activo == 1) {
                        return (
                          <option key={item.id_banco} value={item.id_banco}>
                            {item.nombre}
                          </option>
                        )
                      }
                    })}
                  </CFormSelect>
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <MdAttachMoney />
                  </CInputGroupText>
                  <CFormSelect name="id_moneda" onChange={handleInput}>
                    <option>Seleccione un tipo de moneda. (Obligatorio)</option>
                    {results1.map((item, i) => {
                      if (item.eliminado == 0 && item.activo == 1) {
                        return (
                          <option key={item.id_moneda} value={item.id_moneda}>
                            {item.nombre}
                          </option>
                        )
                      }
                    })}
                  </CFormSelect>
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FiCreditCard />
                  </CInputGroupText>
                  <CFormControl
                    type="text"
                    placeholder="Código ACH"
                    name="codigo_ach"
                    onChange={handleInput}
                  />
                </CInputGroup>
                <CButton color="primary" onClick={handleSubmit}>
                  Añadir Cuenta
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

export default NuevoBanco
