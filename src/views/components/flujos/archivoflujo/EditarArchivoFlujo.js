import React, { useState } from 'react'
import FileUploader from '../../../../components/FileUploader'
import { useSession } from 'react-use-session'
import { Alert } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import { postArchivoFlujo } from '../../../../services/postArchivoFlujo'
import { FiUser, FiFile, FiDownloadCloud, FiSettings } from 'react-icons/fi'
import '../../../../scss/estilos.scss'
import {
  CButton,
  CCard,
  CCardBody,
  CContainer,
  CForm,
  CInputGroupText,
  CFormControl,
  CInputGroup,
  CFormSelect,
} from '@coreui/react'

const EditarGrupo = () => {
  const history = useHistory()
  const location = useLocation()
  const { session } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const [form, setValues] = useState({
    id_flujo: location.id_flujo,
    descripcion: location.descripcion,
    estado: location.estado,
    archivos: [],
  })

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    if (form.descripcion !== '' && form.archivos !== '' && form.estado !== '') {
      event.preventDefault()
      const respuesta = await postArchivoFlujo(
        location.id_archivoflujo,
        form.id_flujo,
        location.id_usuario,
        form.descripcion,
        form.archivos,
        '1',
        session.api_token,
      )
      if (respuesta === 'OK' && location.opcion === '1') {
        history.go(-2)
      } else if (respuesta === 'OK' && location.opcion === '0') {
        history.go(-1)
      }
    } else {
      setShow(true)
      setMensaje('No has llenado todos los campos')
    }
  }

  const handlerUploadFile = (file) => {
    setValues({
      ...form,
      archivos: [...form.archivos, file],
    })
  }

  const handlerRemoveFile = (file) => {
    setValues({
      ...form,
      archivos: [
        ...form.archivos.filter(function (item) {
          return item !== file
        }),
      ],
    })
  }

  const handlerRemoveAll = () => {
    setValues({
      ...form,
      archivos: [],
    })
  }

  if (session) {
    if (location.id_archivoflujo) {
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
                  <h1>Modificación del Archivo de Flujo</h1>
                  <p className="text-medium-emphasis">
                    Modifique la información del registro del archivo de flujo
                  </p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FiUser />
                    </CInputGroupText>
                    <CFormControl
                      type="text"
                      placeholder="Usuario"
                      name="usuario"
                      defaultValue={location.nombre_usuario}
                      disabled={true}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FiFile />
                    </CInputGroupText>
                    <CFormControl
                      placeholder="Descripción"
                      name="descripcion"
                      className="form-control"
                      onChange={handleInput}
                      defaultValue={location.descripcion}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FiDownloadCloud />
                    </CInputGroupText>
                    <CFormControl
                      type="text"
                      onChange={handleInput}
                      value={location.url_archivo}
                      disabled={true}
                    />
                  </CInputGroup>
                  <FileUploader
                    sendData={handlerUploadFile}
                    sendDataRemove={handlerRemoveFile}
                    senDataRemoveAll={handlerRemoveAll}
                  />
                  <CInputGroup className="mb-3" style={{ marginTop: '15px' }}>
                    <CInputGroupText>
                      <FiSettings />
                    </CInputGroupText>
                    <CFormSelect name="estado" onChange={handleInput}>
                      <option>Seleccione estado. (Opcional)</option>
                      <option value="1">Activo</option>
                      <option value="0">Inactivo</option>
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
      history.push('/archivoflujo/archivos')
      return (
        <div className="sin-sesion">
          NO SE CARGÓ EL CÓDIGO DEL ARCHIVO. REGRESE A LA PANTALLA DE PAGOS.
        </div>
      )
    }
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default EditarGrupo
