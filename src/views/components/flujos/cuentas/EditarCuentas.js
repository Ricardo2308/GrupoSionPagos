import React, { useState, useEffect } from 'react'
import { useSession } from 'react-use-session'
import { Alert } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import { postCrudCuentas } from '../../../../services/postCrudCuentas'
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

const EditarBancos = (props) => {
  const history = useHistory()
  const location = useLocation()
  const { session } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
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
    numero_cuenta: location.numero_cuenta,
    nombre: location.nombre,
    id_empresa: location.id_empresa,
    id_banco: location.id_banco,
    id_moneda: location.id_moneda,
    codigo_ach: location.codigo_ach,
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
        location.id_cuenta,
        form.numero_cuenta,
        form.nombre,
        form.id_empresa,
        form.id_banco,
        form.id_moneda,
        form.codigo_ach,
        '1',
      )
      if (respuesta === 'OK') {
        history.push('/cuentas')
      }
    } else {
      setShow(true)
      setMensaje('No has llenado todos los campos.')
    }
  }

  if (session) {
    if (location.id_cuenta) {
      return (
        <div style={{ flexDirection: 'row' }}>
          <CContainer>
            <Alert show={show} variant="danger" onClose={() => setShow(false)} dismissible>
              <Alert.Heading>Error!</Alert.Heading>
              <p>{mensaje}</p>
            </Alert>
            <CCard style={{ display: 'flex', alignItems: 'center' }}>
              <CCardBody style={{ width: '80%' }}>
                <CForm style={{ width: '100%' }} onSubmit={handleSubmit}>
                  <h1>Modificación de Banco</h1>
                  <p className="text-medium-emphasis">Modifique la información del banco</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FiCreditCard />
                    </CInputGroupText>
                    <CFormControl
                      type="text"
                      placeholder="Nombre Cuenta"
                      name="numero_cuenta"
                      onChange={handleInput}
                      defaultValue={location.numero_cuenta}
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
                      defaultValue={location.nombre}
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
                      defaultValue={location.id_empresa}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <RiBankLine />
                    </CInputGroupText>
                    <CFormSelect name="id_banco" onChange={handleInput}>
                      <option>Seleccione un banco. (Opcional)</option>
                      {results.map((item, i) => {
                        if (item.eliminado !== '1' && item.activo !== '0') {
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
                      <option>Seleccione un tipo de moneda. (Opcional)</option>
                      {results1.map((item, i) => {
                        if (item.eliminado !== '1' && item.activo !== '0') {
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
                      defaultValue={location.codigo_ach}
                    />
                  </CInputGroup>
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
      history.push('/cuentas')
      return (
        <div className="sin-sesion">
          NO SE CARGÓ EL CÓDIGO DEL USUARIO. REGRESE A LA PANTALLA DE USUARIOS.
        </div>
      )
    }
  } else {
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default EditarBancos
