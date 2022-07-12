import React, { useState, useEffect, useMemo } from 'react'
import ReactDOM from 'react-dom'
import DataTable, { defaultThemes } from 'react-data-table-component'
import { Modal, Button } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { getArchivosFlujo } from '../../../../services/getArchivosFlujo'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { useSession } from 'react-use-session'
import { useHistory, useLocation } from 'react-router-dom'
import { FaRegFilePdf, FaArrowLeft } from 'react-icons/fa'
import '../../../../scss/estilos.scss'
import DataTableExtensions from 'react-data-table-component-extensions'
import 'react-data-table-component-extensions/dist/index.css'
import 'bulma/css/bulma.css'
import 'material-design-icons/iconfont/material-icons.css'

const ArchivosFlujo = () => {
  const history = useHistory()
  const location = useLocation()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [show, setShow] = useState(false)
  const [mostrar, setMostrar] = useState(false)
  const [urlArchivo, setUrlArchivo] = useState('https://arxiv.org/pdf/quant-ph/0410100.pdf')
  const [mensaje, setMensaje] = useState('')
  const [titulo, setTitulo] = useState('')
  const filteredItems = results
  const cerrarPDF = () => setMostrar(false)

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

  useEffect(() => {
    let mounted = true
    getArchivosFlujo(location.id_flujo, null, session.api_token).then((items) => {
      if (mounted) {
        setList(items.archivos)
      }
    })
    return () => (mounted = false)
  }, [])

  async function Cancelar(opcion) {
    if (opcion == 1) {
      setShow(false)
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
    },
    {
      name: 'Nombre Archvo',
      selector: (row) => row.descripcion,
      center: true,
      sortable: true,
      wrap: true,
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
    if (location.id_flujo) {
      return (
        <>
          {mostrar && ReactDOM.createPortal(modalBody(), document.body)}
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

export default ArchivosFlujo
