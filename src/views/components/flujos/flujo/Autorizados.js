import React, { useState, useEffect, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useIdleTimer } from 'react-idle-timer'
import { Button, FormControl } from 'react-bootstrap'
import DataTable, { createTheme } from 'react-data-table-component'
import { getBitacora } from '../../../../services/getBitacora'
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

const Autorizados = (prop) => {
  const history = useHistory()
  const location = useLocation()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [autorizados, setAutorizados] = useState([])
  const [show, setShow] = useState(false)
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')
  const [filterText, setFilterText] = useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
  const filteredItems = results.filter(
    (item) =>
      item.comments.toLowerCase().includes(filterText.toLowerCase()) ||
      item.doc_date.toLowerCase().includes(filterText.toLowerCase()) ||
      item.doc_num.toLowerCase().includes(filterText.toLowerCase()) ||
      item.activo.toLowerCase().includes(filterText.toLowerCase()),
  )
  const filteredItemsA = autorizados.filter(
    (item) =>
      item.comments.toLowerCase().includes(filterText.toLowerCase()) ||
      item.doc_date.toLowerCase().includes(filterText.toLowerCase()) ||
      item.Pago.toLowerCase().includes(filterText.toLowerCase()) ||
      item.activo.toLowerCase().includes(filterText.toLowerCase()),
  )

  async function leerNotificaciones(IdFlujo, Pago, Estado, Nivel, IdGrupo) {
    if (location.opcion == 1) {
      let pagos = []
      pagos.push(IdFlujo)
      const respuesta = await postNotificacion(pagos, session.id, '', '1')
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
    } else if (location.opcion == 2) {
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
    if (location.comentarios && location.tipo) {
      setAutorizados(location.autorizados)
      getBitacora(null, location.comentarios, session.id, location.tipo).then((items) => {
        if (mounted) {
          setList(items.bitacora)
        }
      })
    } else {
      getBitacora(null, prop.comentarios, session.id, prop.tipo).then((items) => {
        if (mounted) {
          setList(items.bitacora)
        }
      })
    }
    return () => (mounted = false)
  }, [])

  const handleOnIdle = (event) => {
    setShow(true)
    setOpcion(2)
    setMensaje('Ya estuvo mucho tiempo sin realizar ninguna acción. Desea continuar?')
    console.log('last active', getLastActiveTime())
  }

  const handleOnActive = (event) => {
    console.log('time remaining', getRemainingTime())
  }

  const handleOnAction = (event) => {}

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * parseInt(session == null ? 1 : session.limiteconexion),
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500,
  })

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
                  id_flujo: row.IdFlujo,
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

  const columnsA = useMemo(() => [
    {
      name: 'Número Documento',
      selector: 'Pago',
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
                leerNotificaciones(row.IdFlujo, row.Pago, row.estado, row.nivel, row.IdGrupo)
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
              columns={columnsA}
              noDataComponent="No hay pagos que mostrar"
              data={filteredItemsA}
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
            <div className="datatable-aprobados">Pagos Aprobados</div>
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
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default Autorizados
