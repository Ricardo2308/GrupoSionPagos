import React, { useState, useEffect } from 'react'
import { useSession } from 'react-use-session'
import { useHistory, useLocation } from 'react-router-dom'
import { postUsuarioGrupo } from '../../../../services/postUsuarioGrupo'
import { getGruposAutorizacion } from '../../../../services/getGruposAutorizacion'
import { getUsuarioGrupo } from '../../../../services/getUsuarioGrupo'
import { FiUser, FiAtSign } from 'react-icons/fi'
import { FaUsers } from 'react-icons/fa'
import '../../../../scss/estilos.scss'
import { Modal, Alert } from 'react-bootstrap'
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

const EditarUsuarioGrupo = (props) => {
  const history = useHistory()
  const location = useLocation()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [detalle, setDetalle] = useState([])
  const [show, setShow] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [titulo, setTitulo] = useState('Error!')
  const [color, setColor] = useState('danger')

  const handleClose = () => setShowModal(false)

  const [form, setValues] = useState({
    grupo_autorizacion: location.id_grupo,
    estado: location.estado,
    nivel: location.nivel,
  })

  useEffect(() => {
    let mounted = true
    getGruposAutorizacion(null, null).then((items) => {
      if (mounted) {
        setList(items.grupos)
      }
    })
    getUsuarioGrupo(location.id_usuario, null).then((items) => {
      if (mounted) {
        setDetalle(items.detalle)
      }
    })
    return () => (mounted = false)
  }, [])

  function Repetido(dato) {
    let result = 0
    for (let item of detalle) {
      if (dato === item.id_grupoautorizacion) {
        result = 1
      }
    }
    return result
  }

  function obtenerNiveles(num_niveles) {
    var niveles = []
    for (let i = 0; i < num_niveles; i++) {
      niveles.push(i + 1)
    }
    return niveles
  }

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    if (Repetido(form.grupo_autorizacion)) {
      setShowModal(true)
      setTitulo('Grupo Repetido!')
      setColor('warning')
      setMensaje('Este grupo ya está asignado al usuario. Desea cambiar el nivel?')
    } else {
      if (form.grupo_autorizacion !== '') {
        event.preventDefault()
        const respuesta = await postUsuarioGrupo(
          location.id_usuariogrupo,
          location.id_usuario,
          '2',
          form.grupo_autorizacion,
          form.nivel,
          '',
        )
        if (respuesta === 'OK') {
          history.push('/usuarios')
        }
      } else {
        setShow(true)
        setTitulo('Error!')
        setColor('danger')
        setMensaje('No has llenado todos los campos')
      }
    }
  }

  const CambiarNivel = async (event) => {
    if (form.nivel !== '') {
      event.preventDefault()
      const respuesta = await postUsuarioGrupo(
        location.id_usuariogrupo,
        '',
        '4',
        '',
        form.nivel,
        '',
      )
      if (respuesta === 'OK') {
        history.push('/usuarios')
      }
    } else {
      setShow(true)
      setTitulo('Error!')
      setColor('danger')
      setMensaje('No has llenado todos los campos')
    }
  }

  if (session) {
    if (location.id_usuario) {
      return (
        <div style={{ flexDirection: 'row' }}>
          <CContainer>
            <Alert show={show} variant={color} onClose={() => setShow(false)} dismissible>
              <Alert.Heading>{titulo}</Alert.Heading>
              <p>{mensaje}</p>
            </Alert>
            <Modal variant="primary" show={showModal} onHide={handleClose} centered>
              <Modal.Header closeButton>
                <Modal.Title>{titulo}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>
                  <div className="modal-message">{mensaje}</div>
                  <CForm>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>Nivel</CInputGroupText>
                      <CFormSelect name="nivel" onChange={handleInput}>
                        <option>Seleccione un nivel de autorización. (Opcional)</option>
                        {results.map((item, i) => {
                          if (item.id_grupo == form.grupo_autorizacion) {
                            var niveles = obtenerNiveles(item.numero_niveles)
                            return niveles.map((nivel) => {
                              return (
                                <option key={nivel.toString()} value={nivel}>
                                  {nivel}
                                </option>
                              )
                            })
                          }
                        })}
                      </CFormSelect>
                    </CInputGroup>
                  </CForm>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <CButton color="secondary" onClick={handleClose}>
                  Cancelar
                </CButton>
                <CButton color="primary" onClick={CambiarNivel}>
                  Aceptar
                </CButton>
              </Modal.Footer>
            </Modal>
            <CCard style={{ display: 'flex', alignItems: 'center' }}>
              <CCardBody style={{ width: '80%' }}>
                <CForm style={{ width: '100%' }}>
                  <h1>Asignación Nuevo Grupo Autorización</h1>
                  <p className="text-medium-emphasis">Asigne un grupo de autorización al usuario</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FiUser />
                    </CInputGroupText>
                    <CFormControl
                      type="text"
                      placeholder="Nombre"
                      name="nombre"
                      value={location.nombre}
                      disabled={true}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FiAtSign />
                    </CInputGroupText>
                    <CFormControl
                      type="email"
                      placeholder="Correo"
                      name="email"
                      value={location.email}
                      onChange={handleInput}
                      disabled={true}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FaUsers />
                    </CInputGroupText>
                    <CFormSelect name="grupo_autorizacion" onChange={handleInput}>
                      <option selected={true} value={location.id_grupo}>
                        {location.identificador}
                      </option>
                      {results.map((item, i) => {
                        if (
                          item.eliminado == 0 &&
                          item.activo == 1 &&
                          item.id_grupo !== location.id_grupo
                        ) {
                          return (
                            <option key={item.id_grupo} value={item.id_grupo}>
                              {item.identificador}
                            </option>
                          )
                        }
                      })}
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
      history.push('/usuarios')
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

export default EditarUsuarioGrupo
