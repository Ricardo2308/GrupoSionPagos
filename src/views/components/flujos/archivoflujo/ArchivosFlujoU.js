import React, { useState, useEffect, useMemo } from 'react'
import DataTable, { createTheme, defaultThemes } from 'react-data-table-component'
import { Modal, Button, FormControl } from 'react-bootstrap'
import { PDFReader } from 'reactjs-pdf-view'
import { useIdleTimer } from 'react-idle-timer'
import { getArchivosFlujo } from '../../../../services/getArchivosFlujo'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { useSession } from 'react-use-session'
import { useHistory, useLocation } from 'react-router-dom'
import { FaRegFilePdf, FaArrowLeft } from 'react-icons/fa'
import '../../../../scss/estilos.scss'
import DataTableExtensions from 'react-data-table-component-extensions'
import 'react-data-table-component-extensions/dist/index.css'

const ArchivosFlujo = () => {
  const history = useHistory()
  const location = useLocation()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [show, setShow] = useState(false)
  const [mostrar, setMostrar] = useState(false)
  const [urlArchivo, setUrlArchivo] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [titulo, setTitulo] = useState('')
  const filteredItems = results
  const cerrarPDF = () => setMostrar(false)

  useEffect(() => {
    let mounted = true
    getArchivosFlujo(location.id_flujo, null).then((items) => {
      if (mounted) {
        setList(items.archivos)
      }
    })
    return () => (mounted = false)
  }, [])

  async function Cancelar(opcion) {
    if (opcion == 1) {
      setShow(false)
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
    setShow(true)
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
      width: '30%',
      sortable: true,
      wrap: true,
    },
    {
      name: 'Nombre Archvo',
      selector: (row) => row.descripcion,
      center: true,
      width: '30%',
      sortable: true,
      wrap: true,
    },
    {
      name: 'Estado',
      center: true,
      width: '30%',
      cell: function OrderItems(row) {
        if (row.activo == 1) {
          return <div>Activo</div>
        } else if (row.activo == 0) {
          return <div>Inactivo</div>
        }
      },
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
            </Button>
          </div>
        )
      },
      center: true,
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

  if (session) {
    return (
      <>
        <Modal show={mostrar} onHide={cerrarPDF} centered dialogClassName="my-modal">
          <Modal.Header className="modal-bg" closeButton>
            <Modal.Title>{titulo}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ overflow: 'scroll', height: 430 }}>
              <PDFReader url={urlArchivo} showAllPage={true} getPageNumber={1} />
            </div>
          </Modal.Body>
          <Modal.Footer className="modal-bg">
            <Button variant="success">
              <a style={{ textDecoration: 'none', color: 'white' }} href={urlArchivo} download>
                Descargar
              </a>
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal responsive variant="primary" show={show} onHide={() => Cancelar(2)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación</Modal.Title>
          </Modal.Header>
          <Modal.Body>{mensaje}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => Cancelar(2)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => Cancelar(1)}>
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="float-left" style={{ marginBottom: '10px' }}>
          <Button variant="primary" size="sm" onClick={() => history.goBack()}>
            <FaArrowLeft />
            &nbsp;&nbsp;Regresar
          </Button>
        </div>
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
      </>
    )
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default ArchivosFlujo
