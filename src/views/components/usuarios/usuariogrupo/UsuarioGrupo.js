import React, { useState, useEffect } from 'react'
import { useSession } from 'react-use-session'
import { Modal } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import { postUsuarioGrupo } from '../../../../services/postUsuarioGrupo'
import { getGruposAutorizacion } from '../../../../services/getGruposAutorizacion'
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
import { FiUser, FiAtSign, FiSettings } from 'react-icons/fi'

const UsuarioGrupo = () => {
  const history = useHistory()
  const location = useLocation()
  const { session } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [results, setList] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [idUsuario, setIdUsuario] = useState(0)

  const handleClose = () => setShow(false)

  const [form, setValues] = useState({
    grupo_autorizacion: location.id_grupo,
    estado: location.estado,
  })

  useEffect(() => {
    let mounted = true
    getGruposAutorizacion(null, null).then((items) => {
      if (mounted) {
        setList(items.grupos)
        console.log(items)
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
    event.preventDefault()
    const respuesta = await postUsuarioGrupo(location.id, '1', form.grupo_autorizacion, '')
    if (respuesta === 'OK') {
      history.push('/base/usuarios')
    } else if (respuesta === 'Error') {
      setShow(true)
      setMensaje('Error de conexión.')
    } else {
      mostrarModal(location.id)
      setMensaje('Desea elegir otro grupo de autorización para el usuario ' + respuesta + '?')
    }
  }

  function mostrarModal(id_usuario) {
    setIdUsuario(id_usuario)
    setShow(true)
  }

  async function editarUsuarioGrupo(id_usuario) {
    const respuesta = await postUsuarioGrupo(id_usuario, '3', form.grupo_autorizacion, form.estado)
    if (respuesta === 'OK') {
      history.push('/base/usuarios')
    }
  }

  if (session) {
    if (location.id) {
      return (
        <div style={{ flexDirection: 'row' }}>
          <CContainer>
            <Modal responsive variant="primary" show={show} onHide={handleClose} centered>
              <Modal.Header closeButton>
                <Modal.Title>Confirmación</Modal.Title>
              </Modal.Header>
              <Modal.Body>{mensaje}</Modal.Body>
              <Modal.Footer>
                <CButton color="secondary" onClick={handleClose}>
                  Cancelar
                </CButton>
                <CButton
                  color="primary"
                  onClick={() => editarUsuarioGrupo(idUsuario).then(handleClose)}
                >
                  Aceptar
                </CButton>
              </Modal.Footer>
            </Modal>
            <CCard style={{ display: 'flex', alignItems: 'center' }}>
              <CCardBody style={{ width: '80%' }}>
                <CForm style={{ width: '100%' }} onSubmit={handleSubmit}>
                  <h1>Asignación de Grupo de Autorización</h1>
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
                      <FiSettings />
                    </CInputGroupText>
                    <CFormSelect name="grupo_autorizacion" onChange={handleInput}>
                      <option>Seleccione un grupo. (Opcional)</option>
                      {results.map((item, i) => {
                        if (item.eliminado !== '1' && item.activo !== '0') {
                          return (
                            <option key={item.id_grupo} value={item.id_grupo}>
                              {item.identificador}
                            </option>
                          )
                        }
                      })}
                    </CFormSelect>
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
      history.push('/base/usuarios')
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

export default UsuarioGrupo
