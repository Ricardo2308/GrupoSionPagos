import React, { useState, useEffect, useMemo } from 'react'
import ReactDOM from 'react-dom'
import { useSession } from 'react-use-session'
import { Alert, Modal, Button } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { useHistory, useLocation } from 'react-router-dom'
import FileUploader from '../../../../components/FileUploader'
import { postFlujos } from '../../../../services/postFlujos'
import { postArchivoFlujo } from '../../../../services/postArchivoFlujo'
import { postFlujoDetalle } from '../../../../services/postFlujoDetalle'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
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
import { FaArrowLeft, FaRegFilePdf, FaTrash, FaEdit } from 'react-icons/fa'
import { getArchivosFlujo } from '../../../../services/getArchivosFlujo'
import DataTable, { defaultThemes } from 'react-data-table-component'
import DataTableExtensions from 'react-data-table-component-extensions'
import 'react-data-table-component-extensions/dist/index.css'
import 'bulma/css/bulma.css'
import 'material-design-icons/iconfont/material-icons.css'

const NuevoArchivoFlujo = (props) => {
  const history = useHistory()
  const location = useLocation()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [show, setShow] = useState(false)
  const [showM, setShowM] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [color, setColor] = useState('danger')
  const [titulo, setTitulo] = useState('Error!')
  const [descripcion, setDescripcion] = useState(location.pago)
  const [archivos, setArchivos] = useState([])
  const [mostrar, setMostrar] = useState(false)
  const [urlArchivo, setUrlArchivo] = useState('https://arxiv.org/pdf/quant-ph/0410100.pdf')
  const filteredItems = results
  const [cargaArchivo, setCargaArchivo] = useState(false)
  const [llaveArchivos, setLlaveArchivos] = useState(0)
  const [showME, setShowME] = useState(false)
  const [showMF, setShowMF] = useState(false)
  const [mensajeE, setMensajeE] = useState('')
  const [mensajeF, setMensajeF] = useState('')
  const [archivoEliminar, setArchivoEliminar] = useState(0)
  const [MostrarFinalizarCarga, setMostrarFinalizarCarga] = useState(false)

  useEffect(() => {
    let mounted = true
    getArchivosFlujo(location.id_flujo, null, session.api_token).then((items) => {
      if (mounted) {
        if (items.archivos.length > 0) {
          if (location.estado > 1) {
            setMostrarFinalizarCarga(false)
          } else {
            setMostrarFinalizarCarga(true)
          }
        } else {
          setMostrarFinalizarCarga(false)
        }
        setList(items.archivos)
      }
    })
    return () => (mounted = false)
  }, [cargaArchivo])

  const modalBody = () => (
    <div
      style={{
        background: 'rgba(0,0,0,0.7)',
        left: 0,
        position: 'fixed',
        top: 0,
        height: '100%',
        width: '100%',
        zIndex: 10001,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'scroll',
      }}
    >
      <div className="float-right" style={{ margin: '10px', textAlign: 'right' }}>
        <Button variant="danger" size="sm" onClick={() => setMostrar(false)}>
          Cerrar
        </Button>
      </div>
      <object data={urlArchivo} type="application/pdf" width="100%" height="100%">
        <p>
          Alternative text - include a link <a href={urlArchivo}>to the PDF!</a>
        </p>
      </object>
    </div>
  )

  const handleInput = (event) => {
    setDescripcion(event.target.value)
  }

  const finalizarCarga = async () => {
    const respuesta = await postFlujos(
      location.id_flujo,
      '',
      location.grupo,
      '',
      null,
      session.id,
      session.api_token,
    )
    if (location.grupo == null) {
      const answer = await postFlujoDetalle(
        location.id_flujo,
        '2',
        session.id,
        'Documento de pago cargado',
        '0',
        session.api_token,
      )
      if (answer === 'OK') {
        history.go(-1)
      }
    } else {
      const cargado = await postFlujoDetalle(
        location.id_flujo,
        '2',
        session.id,
        'Documento de pago cargado',
        '0',
        session.api_token,
      )
      const asignado = await postFlujoDetalle(
        location.id_flujo,
        '3',
        session.id,
        'Asignado a responsable',
        '0',
        session.api_token,
      )
      if (cargado === 'OK' && asignado === 'OK') {
        const respuesta = await postFlujos(
          location.id_flujo,
          '',
          location.grupo,
          '',
          null,
          session.id,
          session.api_token,
        )
        if (respuesta === 'OK') {
          history.go(-1)
        }
      }
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (descripcion !== '' && archivos.length > 0) {
      const respuesta = await postArchivoFlujo(
        '',
        location.id_flujo,
        session.id,
        descripcion,
        archivos,
        '',
        '',
        session.api_token,
      )
      if (respuesta === 'OK') {
        setCargaArchivo(!cargaArchivo)
        handlerRemoveAll()
        setLlaveArchivos(llaveArchivos + 1)
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
  const handlerUploadFile = (file) => {
    setArchivos([...archivos, file])
  }

  const handlerRemoveFile = (file) => {
    setArchivos([
      ...archivos.filter(function (item) {
        return item !== file
      }),
    ])
  }

  const handlerRemoveAll = () => {
    setArchivos([])
  }

  const customStyles = {
    headRow: {
      style: {
        borderTopStyle: 'solid',
        borderTopWidth: '1px',
        borderTopColor: defaultThemes.default.divider.default,
      },
    },
    headCells: {
      style: {
        paddingLeft: '8px', // override the cell padding for head cells
        paddingRight: '8px',
        fontSize: '12px',
        '&:not(:last-of-type)': {
          borderRightStyle: 'solid',
          borderRightWidth: '1px',
          borderRightColor: defaultThemes.default.divider.default,
        },
      },
    },
    cells: {
      style: {
        '&:not(:last-of-type)': {
          borderRightStyle: 'solid',
          borderRightWidth: '1px',
          borderRightColor: defaultThemes.default.divider.default,
        },
      },
    },
  }

  const columns = useMemo(() => [
    {
      name: '#',
      selector: (row, index) => index + 1,
      sortable: true,
      width: '60px',
    },
    {
      name: 'Usuario',
      selector: (row) => row.nombre_usuario,
      center: true,
      sortable: true,
      wrap: true,
      width: '170px',
    },
    {
      name: 'Nombre Archivo',
      selector: (row) => row.descripcion,
      center: true,
      sortable: true,
      wrap: true,
      width: '190px',
    },
    {
      name: 'Archivo',
      cell: function OrderItems(row) {
        return (
          <div style={{ alignItems: 'center' }}>
            <object data={row.archivo} type="application/pdf" width="100%" height="100%">
              <p>
                Alternative text - include a link <a href={row.archivo}>to the PDF!</a>
              </p>
            </object>
          </div>
        )
      },
      center: true,
      width: '490px',
    },
    {
      name: 'Acciones',
      cell: function OrderItems(row) {
        return (
          <div style={{ alignItems: 'center' }}>
            <Button
              variant="outline-danger"
              size="sm"
              target="_blank"
              title="Ver PDF"
              onClick={() => mostrarModal(row.archivo, session.user_name)}
            >
              <FaRegFilePdf />
            </Button>{' '}
            <CButton
              color="success"
              size="sm"
              title="Editar archivo"
              onClick={() =>
                history.push({
                  pathname: '/archivoflujo/editar',
                  id_archivoflujo: row.id_archivoflujo,
                  ArchivoOriginal: row.archivo_original,
                  id_flujo: location.id_flujo,
                  pago: location.pago,
                  grupo: location.grupo,
                  estado: location.estado,
                })
              }
            >
              <FaEdit />
            </CButton>{' '}
            <CButton
              color="danger"
              size="sm"
              title="Eliminar archivo"
              onClick={() => mostrarModalEliminar(row.id_archivoflujo)}
            >
              <FaTrash />
            </CButton>
          </div>
        )
      },
      center: true,
      width: '130px',
    },
  ])
  const tableData = {
    columns: columns,
    data: filteredItems,
    filterPlaceholder: 'Filtrar datos',
    export: false,
    print: false,
  }

  function mostrarModal(url_archivo, usuario) {
    setUrlArchivo(url_archivo)
    setTitulo('Cargado por ' + usuario)
    setMostrar(true)
  }

  function mostrarModalEliminar(id_archivoflujo) {
    setArchivoEliminar(id_archivoflujo)
    setMensajeE('¿Está seguro de eliminar este archivo?')
    setShowME(true)
  }

  function mostrarFinalizarCarga() {
    setMensajeF('¿Está seguro de finalizar la carga y pasar al siguiente paso?')
    setShowMF(true)
  }

  async function Accion(opcion) {
    if (opcion == 1) {
      const respuesta = await postArchivoFlujo(
        archivoEliminar,
        '',
        '',
        '',
        '',
        '',
        '1',
        session.api_token,
      )
      if (respuesta === 'OK') {
        setCargaArchivo(!cargaArchivo)
      }
      setShowME(false)
    } else if (opcion == 2) {
      setShowME(false)
    } else if (opcion == 3) {
      setShowMF(false)
      finalizarCarga()
    } else if (opcion == 4) {
      setShowMF(false)
    }
  }

  if (session) {
    if (location.id_flujo) {
      return (
        <>
          {mostrar && ReactDOM.createPortal(modalBody(), document.body)}
          <div className="float-left" style={{ marginBottom: '10px' }}>
            <Button variant="primary" size="sm" onClick={() => history.goBack()}>
              <FaArrowLeft />
              &nbsp;&nbsp;Regresar
            </Button>
          </div>
          <div className="float-right" style={{ marginBottom: '10px' }}>
            <Button
              className={!MostrarFinalizarCarga ? 'd-none' : ''}
              variant="success"
              size="sm"
              onClick={() => mostrarFinalizarCarga()}
            >
              Finalizar carga de archivos
            </Button>
          </div>
          <br />
          <br />
          <div style={{ flexDirection: 'row' }}>
            <CContainer>
              <Modal
                key="showM"
                responsive
                variant="primary"
                show={showM}
                onHide={() => Cancelar(2)}
                centered
              >
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
              <Modal
                key="showME"
                responsive
                variant="primary"
                show={showME}
                onHide={() => Accion(2)}
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Confirmación</Modal.Title>
                </Modal.Header>
                <Modal.Body>{mensajeE}</Modal.Body>
                <Modal.Footer>
                  <CButton color="secondary" onClick={() => Accion(2)}>
                    Cancelar
                  </CButton>
                  <CButton color="primary" onClick={() => Accion(1)}>
                    Aceptar
                  </CButton>
                </Modal.Footer>
              </Modal>
              <Modal
                key="showMF"
                responsive
                variant="primary"
                show={showMF}
                onHide={() => Accion(4)}
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Confirmación</Modal.Title>
                </Modal.Header>
                <Modal.Body>{mensajeF}</Modal.Body>
                <Modal.Footer>
                  <CButton color="secondary" onClick={() => Accion(4)}>
                    Cancelar
                  </CButton>
                  <CButton color="primary" onClick={() => Accion(3)}>
                    Aceptar
                  </CButton>
                </Modal.Footer>
              </Modal>
              <Alert show={show} variant={color} onClose={() => setShow(false)} dismissible>
                <Alert.Heading>{titulo}</Alert.Heading>
                <p>{mensaje}</p>
              </Alert>
              <br />
              <br />
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
                      key={llaveArchivos}
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
          <br />
          <br />
          <div style={{ flexDirection: 'row' }}>
            <CContainer>
              <CCard style={{ display: 'flex', alignItems: 'center' }}>
                <CCardBody style={{ width: '100%' }}>
                  <h1>Archivos de Flujo</h1>
                  <br />
                  <br />
                  <DataTableExtensions {...tableData}>
                    <DataTable
                      columns={columns}
                      noDataComponent="No hay archivos que mostrar"
                      data={filteredItems}
                      customStyles={customStyles}
                      pagination
                      paginationPerPage={25}
                      responsive={true}
                      persistTableHead
                      striped={true}
                      dense
                    />
                  </DataTableExtensions>
                </CCardBody>
              </CCard>
            </CContainer>
          </div>
        </>
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
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default NuevoArchivoFlujo
