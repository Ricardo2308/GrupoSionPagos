import React, { useState, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, FormControl } from 'react-bootstrap'
import DataTable, { createTheme } from 'react-data-table-component'
import { getPendientesReporte } from '../../../services/getPendientesReporte'
import { getPoliticas } from '../../../services/getPoliticas'
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
  const [politicas, setPoliticas] = useState([])
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
    getPoliticas(null, null).then((items) => {
      if (mounted) {
        setPoliticas(items.politicas)
      }
    })
    return () => (mounted = false)
  }, [])

  function obtenerPolitica(politica) {
    let result = ''
    for (let item of politicas) {
      if (item.identificador == politica) {
        result = item.valor
      }
    }
    return result
  }

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
      name: 'Documento',
      selector: 'doc_num',
      center: true,
      width: '100px',
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
      width: '270px',
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
      width: '190px',
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
      width: '90px',
    },
    {
      name: 'Días Vencimiento',
      center: true,
      width: '120px',
      cell: function OrderItems(row) {
        if (row.dias_vencimiento <= 0) {
          return <div>0</div>
        } else {
          return <div>{row.dias_vencimiento}</div>
        }
      },
    },
  ])

  const conditionalRowStyles = [
    {
      when: (row) => row.porcentaje <= parseInt(obtenerPolitica('_SEMAFORO_VERDE')),
      style: {
        backgroundColor: '#DAFDDA',
        '&:hover': {
          cursor: 'pointer',
        },
      },
    },
    {
      when: (row) =>
        row.porcentaje > parseInt(obtenerPolitica('_SEMAFORO_VERDE')) &&
        row.porcentaje <= parseInt(obtenerPolitica('_SEMAFORO_AMARILLO')),
      style: {
        backgroundColor: '#F6FAD0',
        '&:hover': {
          cursor: 'pointer',
        },
      },
    },
    {
      when: (row) => row.porcentaje > parseInt(obtenerPolitica('_SEMAFORO_AMARILLO')),
      style: {
        backgroundColor: '#FBE0E0',
        '&:hover': {
          cursor: 'pointer',
        },
      },
    },
  ]

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
        paginationPerPage={30}
        paginationResetDefaultPage={resetPaginationToggle}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        responsive={true}
        persistTableHead
        conditionalRowStyles={conditionalRowStyles}
      />
    )
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default Pendientes
