import React, { useState, useEffect, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Button, FormControl } from 'react-bootstrap'
import DataTable, { createTheme, defaultThemes } from 'react-data-table-component'
import { getAutorizados } from '../../../../services/getAutorizados'
import { postNotificacion } from '../../../../services/postNotificacion'
import { useSession } from 'react-use-session'
import { FaList } from 'react-icons/fa'
import '../../../../scss/estilos.scss'
import DataTableExtensions from 'react-data-table-component-extensions'
import 'react-data-table-component-extensions/dist/index.css'

const Autorizados = (prop) => {
  const history = useHistory()
  const location = useLocation()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [autorizados, setAutorizados] = useState([])
  const filteredItems = results
  const filteredItemsA = autorizados

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
    if (location.tipo) {
      setAutorizados(location.autorizados)
      getAutorizados(session.id, location.tipo).then((items) => {
        if (mounted) {
          setList(items.bitacora)
        }
      })
    } else {
      getAutorizados(session.id, prop.tipo).then((items) => {
        if (mounted) {
          setList(items.bitacora)
        }
      })
    }
    return () => (mounted = false)
  }, [])

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

  const formatear = (valor, moneda) => {
    if (moneda === 'QTZ') {
      return formatter.format(valor)
    } else {
      return formatterDolar.format(valor)
    }
  }

  let formatter = new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
  })
  let formatterDolar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  const columns = useMemo(() => [
    {
      name: 'Empresa',
      selector: (row) => row.empresa_nombre,
      center: true,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      wrap: true,
      width: '15%',
    },
    {
      name: 'No.',
      selector: (row) => row.doc_num,
      center: true,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      width: '8%',
    },
    {
      name: 'Fecha Documento',
      selector: (row) => row.doc_date,
      center: true,
      sortable: true,
      style: {
        fontSize: '11px',
      },
      width: '10%',
    },
    {
      name: 'Beneficiario',
      selector: (row) => row.card_name,
      center: true,
      sortable: true,
      style: {
        fontSize: '11px',
      },
      wrap: true,
    },
    {
      name: 'Concepto',
      selector: (row) => row.comments,
      center: true,
      style: {
        fontSize: '11px',
      },
      wrap: true,
    },
    {
      name: 'Monto',
      selector: (row) => formatear(row.doc_total, row.doc_curr),
      center: true,
      style: {
        fontSize: '11px',
      },
      width: '12%',
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
      width: '8%',
    },
  ])

  const columnsA = useMemo(() => [
    {
      name: 'Empresa',
      selector: (row) => row.empresa_nombre,
      center: true,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      wrap: true,
      width: '15%',
    },
    {
      name: 'No.',
      selector: (row) => row.Pago,
      center: true,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      width: '8%',
    },
    {
      name: 'Fecha Documento',
      selector: (row) => row.doc_date,
      center: true,
      sortable: true,
      style: {
        fontSize: '11px',
      },
      width: '10%',
    },
    {
      name: 'Beneficiario',
      selector: (row) => row.card_name,
      center: true,
      sortable: true,
      style: {
        fontSize: '11px',
      },
      wrap: true,
    },
    {
      name: 'Concepto',
      selector: (row) => row.comments,
      center: true,
      style: {
        fontSize: '11px',
      },
      wrap: true,
    },
    {
      name: 'Monto',
      selector: (row) => formatear(row.doc_total, row.doc_curr),
      center: true,
      style: {
        fontSize: '11px',
      },
      width: '12%',
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
      width: '8%',
    },
  ])
  const tableData = {
    columns: columns,
    data: filteredItems,
    filterPlaceholder: 'Filtrar datos',
    export: false,
    print: false,
  }
  const tableDataA = {
    columns: columnsA,
    data: filteredItemsA,
    filterPlaceholder: 'Filtrar datos',
    export: false,
    print: false,
  }

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
            <DataTableExtensions {...tableDataA}>
              <DataTable
                columns={columnsA}
                noDataComponent="No hay pagos que mostrar"
                data={filteredItemsA}
                customStyles={customStyles}
                pagination
                paginationPerPage={5}
                responsive={true}
                persistTableHead
                striped={true}
                dense
              />
            </DataTableExtensions>
          </div>
        </div>
      )
    }
    return (
      <div>
        <div>
          <DataTableExtensions {...tableData}>
            <DataTable
              columns={columns}
              noDataComponent="No hay pagos que mostrar"
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
        </div>
      </div>
    )
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default Autorizados
