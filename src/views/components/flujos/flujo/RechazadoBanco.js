import React, { useState, useEffect, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Button, FormControl } from 'react-bootstrap'
import DataTable, { createTheme } from 'react-data-table-component'
import { getRechazadosBanco } from '../../../../services/getRechazadosBanco'
import { postNotificacion } from '../../../../services/postNotificacion'
import { useSession } from 'react-use-session'
import { FaList } from 'react-icons/fa'
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

const RechazadosBanco = (prop) => {
  const history = useHistory()
  const location = useLocation()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [rechazados, setRechazados] = useState([])
  const [filterText, setFilterText] = useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
  const filteredItems = results.filter(
    (item) =>
      item.comments.toLowerCase().includes(filterText.toLowerCase()) ||
      item.doc_date.toString().toLowerCase().includes(filterText.toLowerCase()) ||
      item.doc_num.toString().toLowerCase().includes(filterText.toLowerCase()),
  )

  const filteredItemsR = rechazados.filter(
    (item) =>
      item.comments.toLowerCase().includes(filterText.toLowerCase()) ||
      item.doc_date.toString().toLowerCase().includes(filterText.toLowerCase()) ||
      item.Pago.toString().toLowerCase().includes(filterText.toLowerCase()),
  )

  async function leerNotificaciones(IdFlujo, Pago, Estado, Nivel, IdGrupo) {
    let pagos = []
    pagos.push(IdFlujo)
    const respuesta = await postNotificacion(pagos, session.id, '', '1', session.api_token)
    if (respuesta == 'OK') {
      history.push({
        pathname: '/pagos/tabs',
        id_flujo: IdFlujo,
        pago: Pago,
        estado: Estado,
        nivel: Nivel,
        id_grupo: IdGrupo,
      })
    }
  }

  useEffect(() => {
    let mounted = true
    if (location.tipo) {
      setRechazados(location.rechazadosBanco)
      getRechazadosBanco(location.tipo, session.id, session.api_token).then((items) => {
        if (mounted) {
          setList(items.flujos)
        }
      })
    } else {
      getRechazadosBanco(prop.tipo, session.id, session.api_token).then((items) => {
        if (mounted) {
          setList(items.flujos)
        }
      })
    }
    return () => (mounted = false)
  }, [])

  const customStyles = {
    headCells: {
      style: {
        paddingLeft: '8px', // override the cell padding for head cells
        paddingRight: '8px',
        fontSize: '12px',
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
      selector: (row) => row.doc_num,
      center: true,
      width: '15%',
    },
    {
      name: 'Fecha Sistema',
      selector: (row) => row.creation_date,
      center: true,
      width: '13%',
    },
    {
      name: 'Detalle',
      selector: (row) => row.comments,
      center: true,
      width: '53%',
    },
    {
      name: 'Estado',
      center: true,
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
                })
              }
            >
              <FaList />
            </Button>
          </div>
        )
      },
      center: true,
    },
  ])

  const columnsR = useMemo(() => [
    {
      name: 'Número Documento',
      selector: (row) => row.Pago,
      center: true,
      width: '15%',
    },
    {
      name: 'Fecha Sis.',
      selector: (row) => row.creation_date,
      center: true,
      width: '13%',
    },
    {
      name: 'Detalle',
      selector: (row) => row.comments,
      center: true,
      width: '53%',
    },
    {
      name: 'Estado',
      center: true,
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
          <div>
            <Button
              data-tag="allowRowEvents"
              variant="success"
              size="sm"
              title="Consultar Detalle Pago"
              onClick={() =>
                leerNotificaciones(row.IdFlujo, row.Pago, row.IdGrupo, row.estado, row.nivel)
              }
            >
              <FaList />
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

  if (session) {
    if (!location.tipo && !prop.tipo) {
      history.push('/dashboard')
      return (
        <div className="sin-sesion">
          NO SE CARGÓ EL NÚMERO DE PAGO. REGRESE A LA PANTALLA DE PAGOS.
        </div>
      )
    }
    if (location.tipo) {
      return (
        <div>
          <div>
            <div className="datatable-title">Pagos Notificados</div>
            <DataTable
              columns={columnsR}
              noDataComponent="No hay pagos que mostrar"
              data={filteredItemsR}
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
          </div>
          <div>
            <div className="datatable-aprobados">Pagos Rechazados</div>
            <DataTable
              columns={columns}
              noDataComponent="No hay pagos que mostrar"
              data={filteredItems}
              customStyles={customStyles}
              theme="solarized"
              pagination
              paginationPerPage={5}
              paginationResetDefaultPage={resetPaginationToggle}
              responsive={true}
              persistTableHead
            />
          </div>
        </div>
      )
    }
    return (
      <div>
        <div>
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
        </div>
      </div>
    )
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default RechazadosBanco
