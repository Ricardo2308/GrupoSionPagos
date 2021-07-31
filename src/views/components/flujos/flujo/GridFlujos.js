import React, { useState, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { Modal, Button, FormControl } from 'react-bootstrap'
import DataTable, { createTheme } from 'react-data-table-component'
import { getFlujos } from '../../../../services/getFlujos'
import { postFlujos } from '../../../../services/postFlujos'
import { useSession } from 'react-use-session'
import { FaTrash, FaList, FaFileUpload } from 'react-icons/fa'
import '../../../../scss/estilos.scss'

const FilterComponent = (prop) => (
  <div className="div-search">
    <FormControl
      id="search"
      type="text"
      placeholder="Buscar Pago"
      aria-label="Search Input"
      value={prop.filterText}
      onChange={prop.onFilter}
    />
    <Button color="primary" className="clear-search" onClick={prop.onClear}>
      X
    </Button>
  </div>
)

const GridFlujos = () => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [show, setShow] = useState(false)
  const [idFlujo, setIdFlujo] = useState(0)
  const [filterText, setFilterText] = useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
  const filteredItems = results.filter(
    (item) =>
      item.comments.toLowerCase().includes(filterText.toLowerCase()) ||
      item.doc_date.toLowerCase().includes(filterText.toLowerCase()) ||
      item.doc_num.toLowerCase().includes(filterText.toLowerCase()) ||
      item.estado_activo.toLowerCase().includes(filterText.toLowerCase()),
  )

  const handleClose = () => setShow(false)

  useEffect(() => {
    let mounted = true
    getFlujos(null, null).then((items) => {
      if (mounted) {
        setList(items.flujos)
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
      name: 'Número Documento',
      selector: 'doc_num',
      center: true,
      width: '15%',
    },
    {
      name: 'Fecha Documento',
      selector: 'doc_date',
      center: true,
    },
    {
      name: 'Detalle',
      selector: 'comments',
      center: true,
      width: '45%',
    },
    {
      name: 'Estado',
      selector: 'estado_activo',
      center: true,
    },
    {
      name: 'Acciones',
      cell: function OrderItems(row) {
        return (
          <div>
            <Button
              data-tag="allowRowEvents"
              size="sm"
              variant="primary"
              onClick={() =>
                history.push({
                  pathname: '/archivoflujo/nuevo',
                  id_flujo: row.id_flujo,
                })
              }
            >
              <FaFileUpload />
            </Button>{' '}
            <Button
              data-tag="allowRowEvents"
              variant="success"
              size="sm"
              onClick={() =>
                history.push({
                  pathname: '/pagos/tabs',
                  id_flujo: row.id_flujo,
                })
              }
            >
              <FaList />
            </Button>{' '}
            <Button
              data-tag="allowRowEvents"
              variant="danger"
              size="sm"
              onClick={() => mostrarModal(row.id_flujo)}
            >
              <FaTrash />
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

  function mostrarModal(id_flujo) {
    setIdFlujo(id_flujo)
    setShow(true)
  }

  async function eliminarUsuario(id_flujo) {
    const respuesta = await postFlujos(id_flujo, '2')
    if (respuesta === 'OK') {
      await getFlujos(null, null).then((items) => {
        setList(items.flujos)
      })
    }
  }

  if (session) {
    return (
      <>
        <Modal responsive variant="primary" show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación</Modal.Title>
          </Modal.Header>
          <Modal.Body>Está seguro de eliminar este flujo?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => eliminarUsuario(idFlujo).then(handleClose)}>
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
        <div>
          <FormControl type="text"></FormControl>
        </div>
        <DataTable
          columns={columns}
          data={filteredItems}
          customStyles={customStyles}
          theme="solarized"
          pagination
          paginationResetDefaultPage={resetPaginationToggle}
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          persistTableHead
        />
      </>
    )
  } else {
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default GridFlujos
