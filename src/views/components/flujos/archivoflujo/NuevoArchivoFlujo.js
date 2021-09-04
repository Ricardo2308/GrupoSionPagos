import React, { useState } from 'react'
import { useSession } from 'react-use-session'
import { Alert } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import FileUploader from '../../../../components/FileUploader'
import { postArchivoFlujo } from '../../../../services/postArchivoFlujo'
import { postFlujoDetalle } from '../../../../services/postFlujoDetalle'
import { FiFile } from 'react-icons/fi'
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
} from '@coreui/react'

const NuevoArchivoFlujo = (props) => {
  const history = useHistory()
  const location = useLocation()
  const { session } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [color, setColor] = useState('danger')
  const [titulo, setTitulo] = useState('Error!')

  const [form, setValues] = useState({
    descripcion: location.pago,
    archivos: [],
  })

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    if (form.descripcion !== '' && form.archivos !== '') {
      event.preventDefault()
      const respuesta = await postArchivoFlujo(
        '',
        location.id_flujo,
        session.id,
        form.descripcion,
        form.archivos,
        '',
      )
      if (respuesta === 'OK') {
        const answer = await postFlujoDetalle(
          location.id_flujo,
          '2',
          session.id,
          'Documento de pago cargado',
        )
        if (answer) {
          history.go(-1)
        }
      } else {
        console.log(respuesta)
      }
    } else {
      setShow(true)
      setTitulo('Error!')
      setColor('danger')
      setMensaje('No has llenado todos los campos.')
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
    if (location.id_flujo) {
      return (
        <div style={{ flexDirection: 'row' }}>
          <CContainer>
            <Alert show={show} variant={color} onClose={() => setShow(false)} dismissible>
              <Alert.Heading>{titulo}</Alert.Heading>
              <p>{mensaje}</p>
            </Alert>
            <CCard style={{ display: 'flex', alignItems: 'center' }}>
              <CCardBody style={{ width: '80%' }}>
                <CForm style={{ width: '100%' }}>
                  <h1>Creación de Archivos de Flujo</h1>
                  <p className="text-medium-emphasis">Cree un nuevo archivo de flujo</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FiFile />
                    </CInputGroupText>
                    <CFormControl
                      placeholder="Descripción"
                      name="descripcion"
                      className="form-control"
                      defaultValue={location.pago}
                      onChange={handleInput}
                    />
                  </CInputGroup>
                  <FileUploader
                    sendData={handlerUploadFile}
                    sendDataRemove={handlerRemoveFile}
                    senDataRemoveAll={handlerRemoveAll}
                    nombre={location.pago}
                  />
                  <CButton
                    color="primary"
                    block
                    onClick={handleSubmit}
                    style={{ marginTop: '15px' }}
                  >
                    Cargar Archivo
                  </CButton>
                </CForm>
              </CCardBody>
            </CCard>
          </CContainer>
        </div>
      )
    } else {
      history.go(-1)
      return (
        <div className="sin-sesion">
          NO SE CARGÓ EL NÚMERO DE PAGO. REGRESE A LA PANTALLA DE PAGOS.
        </div>
      )
    }
  } else {
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default NuevoArchivoFlujo
