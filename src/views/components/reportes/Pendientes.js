import React, { useState, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, FormControl } from 'react-bootstrap'
import DataTable, { createTheme } from 'react-data-table-component'
import { getPendientesReporte } from '../../../services/getPendientesReporte'
import { useSession } from 'react-use-session'
import '../../../scss/estilos.scss'

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

const Pendientes = (prop) => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [filterText, setFilterText] = useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
  const filteredItems = results.filter(
    (item) =>
      item.comments.toLowerCase().includes(filterText.toLowerCase()) ||
      item.doc_date.toLowerCase().includes(filterText.toLowerCase()) ||
      item.doc_num.toLowerCase().includes(filterText.toLowerCase()),
  )

  useEffect(() => {
    let mounted = true
    getPendientesReporte().then((items) => {
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
        fontSize: '13px',
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
      width: '140px',
    },
    {
      name: 'Fecha Documento',
      selector: 'doc_date',
      center: true,
      width: '130px',
    },
    {
      name: 'Detalle',
      center: true,
      width: '300px',
      cell: function OrderItems(row) {
        return <div style={{ textAlign: 'left' }}>{row.comments}</div>
      },
    },
    {
      name: 'Tipo',
      selector: 'tipo',
      center: true,
      width: '130px',
    },
    {
      name: 'Estado',
      center: true,
      width: '208px',
      cell: function OrderItems(row) {
        if (row.nivel > 0) {
          return <div>Autorizado nivel {row.nivel}</div>
        } else {
          return <div>{row.estado}</div>
        }
      },
    },
    {
      name: 'Días Crédito',
      selector: 'dias_credito',
      center: true,
    },
    {
      name: 'Días Vencimiento',
      selector: 'dias_vencimiento',
      center: true,
      width: '120px',
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

  if (session) {
    return (
      <DataTable
        columns={columns}
        noDataComponent="No hay pagos que mostrar"
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
    )
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default Pendientes
