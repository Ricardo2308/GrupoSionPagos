import React, { useState, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, FormControl } from 'react-bootstrap'
import DataTable, { createTheme } from 'react-data-table-component'
import { getFlujos } from '../../../../services/getFlujos'
import { useSession } from 'react-use-session'
import { FaList, FaFileUpload, FaUsersCog } from 'react-icons/fa'
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
      item.doc_num.toLowerCase().includes(filterText.toLowerCase()) ||
      item.activo.toLowerCase().includes(filterText.toLowerCase()),
  )

  useEffect(() => {
    let mounted = true
    getFlujos(null, prop.tipo, session.id, '1', null, null).then((items) => {
      if (mounted) {
        setList(items.flujos)
      }
    })
    const interval = setInterval(() => {
      getFlujos(null, prop.tipo, session.id, null, null, null).then((items) => {
        if (mounted) {
          setList(items.flujos)
        }
      })
    }, 60000)
    return () => clearInterval(interval)
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
      width: '13%',
    },
    {
      name: 'Detalle',
      selector: 'comments',
      center: true,
      width: '53%',
    },
    {
      name: 'Estado',
      center: true,
      cell: function OrderItems(row) {
        if (row.activo === '1') {
          return <div>Activo</div>
        } else if (row.activo === '0') {
          return <div>Inactivo</div>
        }
      },
    },
    {
      name: 'Acciones',
      cell: function OrderItems(row) {
        if (row.estado === '1') {
          return (
            <div>
              <Button
                data-tag="allowRowEvents"
                size="sm"
                variant="primary"
                title="Cargar Archivo"
                onClick={() =>
                  history.push({
                    pathname: '/archivoflujo/nuevo',
                    id_flujo: row.id_flujo,
                    pago: row.doc_num,
                  })
                }
              >
                <FaFileUpload />
              </Button>{' '}
              <Button
                data-tag="allowRowEvents"
                variant="success"
                size="sm"
                title="Consultar Detalle Pago"
                onClick={() =>
                  history.push({
                    pathname: '/pagos/tabs',
                    id_flujo: row.id_flujo,
                    pago: row.doc_num,
                    estado: row.estado,
                    nivel: row.nivel,
                    id_grupo: row.id_grupoautorizacion,
                    pagina: 'transferencia',
                  })
                }
              >
                <FaList />
              </Button>
            </div>
          )
        } else if (row.estado === '2') {
          return (
            <div>
              <Button
                data-tag="allowRowEvents"
                size="sm"
                variant="primary"
                title="Asignar Grupo"
                onClick={() =>
                  history.push({
                    pathname: '/pagos/flujogrupo',
                    id_flujo: row.id_flujo,
                    pago: row.doc_num,
                  })
                }
              >
                <FaUsersCog />
              </Button>{' '}
              <Button
                data-tag="allowRowEvents"
                variant="success"
                size="sm"
                title="Consultar Detalle Pago"
                onClick={() =>
                  history.push({
                    pathname: '/pagos/tabs',
                    id_flujo: row.id_flujo,
                    pago: row.doc_num,
                    estado: row.estado,
                    nivel: row.nivel,
                    id_grupo: row.id_grupoautorizacion,
                    pagina: 'transferencia',
                  })
                }
              >
                <FaList />
              </Button>
            </div>
          )
        } else {
          return (
            <div>
              <Button
                data-tag="allowRowEvents"
                variant="success"
                size="sm"
                title="Consultar Detalle Pago"
                onClick={() =>
                  history.push({
                    pathname: '/pagos/tabs',
                    id_flujo: row.id_flujo,
                    pago: row.doc_num,
                    estado: row.estado,
                    nivel: row.nivel,
                    id_grupo: row.id_grupoautorizacion,
                    pagina: 'transferencia',
                  })
                }
              >
                <FaList />
              </Button>
            </div>
          )
        }
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

  if (session) {
    return (
      <DataTable
        columns={columns}
        noDataComponent="No hay pagos que mostrar"
        data={filteredItems}
        customStyles={customStyles}
        theme="solarized"
        pagination
        paginationPerPage={5}
        paginationResetDefaultPage={resetPaginationToggle}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        responsive={true}
        persistTableHead
      />
    )
  } else {
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default Pendientes
