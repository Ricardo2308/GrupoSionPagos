import React, { useState, useEffect, useMemo } from 'react'
import DataTable, { createTheme } from 'react-data-table-component'
import { Modal, Button, FormControl } from 'react-bootstrap'
import { PDFReader } from 'reactjs-pdf-view'
import { getArchivosFlujo } from '../../../../services/getArchivosFlujo'
import { postArchivoFlujo } from '../../../../services/postArchivoFlujo'
import { useSession } from 'react-use-session'
import { useHistory } from 'react-router-dom'
import { FaRegFilePdf } from 'react-icons/fa'
import '../../../../scss/estilos.scss'

const FilterComponent = (prop) => (
  <div className="div-search">
    <FormControl
      id="search"
      type="text"
      placeholder="Buscar Archivo"
      aria-label="Search Input"
      value={prop.filterText}
      onChange={prop.onFilter}
    />
    <Button
      color="primary"
      className="clear-search"
      onClick={prop.onClear}
      title="Limpiar Campo Búsqueda"
    >
      X
    </Button>
  </div>
)

const ArchivosFlujo = () => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [show, setShow] = useState(false)
  const [mostrar, setMostrar] = useState(false)
  const [idArchivoFlujo, setIdArchivoFlujo] = useState(0)
  const [urlArchivo, setUrlArchivo] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [titulo, setTitulo] = useState('')
  const [filterText, setFilterText] = useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
  const filteredItems = results.filter(
    (item) =>
      item.nombre_usuario.toLowerCase().includes(filterText.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(filterText.toLowerCase()) ||
      item.activo.toLowerCase().includes(filterText.toLowerCase()),
  )

  const handleClose = () => setShow(false)
  const cerrarPDF = () => setMostrar(false)

  useEffect(() => {
    let mounted = true
    getArchivosFlujo(null, session.id).then((items) => {
      if (mounted) {
        setList(items.archivos)
      }
    })
    return () => (mounted = false)
  }, [])

  const customStyles = {
    headCells: {
      style: {
        paddingLeft: '8px', // override the cell padding for head cells
        paddingRight: '8px',
        fontSize: '14px',
      },
    },
  }

  createTheme('solarized', {
    text: {
      primary: 'black',
    },
    background: {
      default: 'white',
    },
    context: {
      background: '#cb4b16',
      text: '#FFFFFF',
    },
    divider: {
      default: '#073642',
    },
    action: {
      button: 'rgba(0,0,0,.54)',
      hover: 'rgba(0,0,0,.08)',
      disabled: 'rgba(0,0,0,.12)',
    },
  })

  const columns = useMemo(() => [
    {
      name: 'Usuario',
      selector: 'nombre_usuario',
      center: true,
      width: '30%',
    },
    {
      name: 'Nombre Archvo',
      selector: 'descripcion',
      center: true,
      width: '30%',
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
              onClick={() => mostrarModal('', row.archivo, session.user_name)}
            >
              <FaRegFilePdf />
            </Button>
          </div>
        )
      },
      center: true,
    },
  ])

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle)
        setFilterText('')
      }
    }
    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    )
  }, [filterText, resetPaginationToggle])

  function mostrarModal(id_archivoflujo, url_archivo, usuario) {
    if (id_archivoflujo !== '' && url_archivo === '' && usuario === '') {
      setIdArchivoFlujo(id_archivoflujo)
      setMensaje('Está seguro de eliminar este documento de pago?')
      setTitulo('Confirmación')
      setShow(true)
    } else if (id_archivoflujo === '' && url_archivo !== '' && usuario !== '') {
      setUrlArchivo(url_archivo)
      setTitulo('Cargado por ' + usuario)
      setMostrar(true)
    }
  }

  async function eliminarArchivoFlujo(id_archivoflujo) {
    const respuesta = await postArchivoFlujo(id_archivoflujo, '', '', '', '', '', '2', '')
    if (respuesta === 'OK') {
      await getArchivosFlujo(null, session.id).then((items) => {
        setList(items.archivos)
      })
    }
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
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{titulo}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{mensaje}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={() => eliminarArchivoFlujo(idArchivoFlujo).then(handleClose)}
            >
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
        <DataTable
          columns={columns}
          noDataComponent="No hay archivos que mostrar"
          data={filteredItems}
          customStyles={customStyles}
          theme="solarized"
          pagination
          paginationPerPage={6}
          paginationResetDefaultPage={resetPaginationToggle}
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          responsive={true}
          persistTableHead
        />
      </>
    )
  } else {
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default ArchivosFlujo
