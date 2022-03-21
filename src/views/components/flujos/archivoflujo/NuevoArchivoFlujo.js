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
import { FaArrowLeft, FaRegFilePdf, FaTrash } from 'react-icons/fa'
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
  const [mensajeE, setMensajeE] = useState('')
  const [archivoEliminar, setArchivoEliminar] = useState(0)
  const [MostrarFinalizarCarga, setMostrarFinalizarCarga] = useState(false)

  useEffect(() => {
    let mounted = true
    getArchivosFlujo(location.id_flujo, null).then((items) => {
      if (mounted) {
        if (items.archivos.length > 0) {
          setMostrarFinalizarCarga(true)
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
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'scroll',
      }}
    >
      <div className="float-right" style={{ margin: '10px' }}>
        <Button variant="primary" size="sm" onClick={() => setMostrar(false)}>
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
    const respuesta = await postFlujos(location.id_flujo, '', location.grupo, '', null)
    if (location.grupo == null) {
      const answer = await postFlujoDetalle(
        location.id_flujo,
        '2',
        session.id,
        'Documento de pago cargado',
        '0',
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
      )
      const asignado = await postFlujoDetalle(
        location.id_flujo,
        '3',
        session.id,
        'Asignado a responsable',
        '0',
      )
      if (cargado === 'OK' && asignado === 'OK') {
        const respuesta = await postFlujos(location.id_flujo, '', location.grupo, '', null)
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

  function iniciar(minutos) {
    let segundos = 60 * minutos
    const intervalo = setInterval(() => {
      segundos--
      if (segundos == 0) {
        Cancelar(2)
      }
    }, 1000)
    setTime(intervalo)
  }

  function detener() {
    clearInterval(time)
  }

  const handleOnIdle = (event) => {
    setShowM(true)
    setMensaje(
      `Ya estuvo mucho tiempo sin realizar ninguna acción. Se cerrará sesión en unos minutos. Si desea continuar presione Aceptar`,
    )
    iniciar(2)
    console.log('last active', getLastActiveTime())
  }

  const handleOnActive = (event) => {
    console.log('time remaining', getRemainingTime())
  }

  const handleOnAction = (event) => {
    return false
  }

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * parseInt(session == null ? 1 : session.limiteconexion),
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500,
  })

  async function Cancelar(opcion) {
    if (opcion == 1) {
      setShowM(false)
      detener()
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
      detener()
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
      name: 'Usuario',
      selector: (row) => row.nombre_usuario,
      center: true,
      sortable: true,
      wrap: true,
      width: '190px',
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
      width: '580px',
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
              color="danger"
              size="sm"
              title="Eliminar Rol"
              onClick={() => mostrarModalEliminar(row.id_archivoflujo)}
            >
              <FaTrash />
            </CButton>
          </div>
        )
      },
      center: true,
      width: '120px',
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

  async function Accion(opcion) {
    if (opcion == 1) {
      const respuesta = await postArchivoFlujo(archivoEliminar, '', '', '', '', '1')
      if (respuesta === 'OK') {
        setCargaArchivo(!cargaArchivo)
      }
      setShowME(false)
    } else if (opcion == 2) {
      setShowME(false)
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
              onClick={() => finalizarCarga()}
            >
              Finalizar carga de archivos
            </Button>
          </div>
          <br />
          <br />
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
              <Modal responsive variant="primary" show={showME} onHide={() => Accion(2)} centered>
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
