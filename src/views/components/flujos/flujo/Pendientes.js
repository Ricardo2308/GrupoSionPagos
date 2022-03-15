import React, { useState, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, FormControl } from 'react-bootstrap'
import DataTable, { defaultThemes } from 'react-data-table-component'
import { getPendientesAutorizacion } from '../../../../services/getPendientesAutorizacion'
import { useSession } from 'react-use-session'
import { FaList, FaFileUpload, FaUsersCog } from 'react-icons/fa'
import '../../../../scss/estilos.scss'
import DataTableExtensions from 'react-data-table-component-extensions'
import 'react-data-table-component-extensions/dist/index.css'

const Pendientes = (prop) => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [data, setListdata] = useState([])

  useEffect(() => {
    let mounted = true
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getPendientesAutorizacion(prop.tipo, idUsuario).then((items) => {
      if (mounted) {
        setListdata(items.flujos)
      }
    })
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
        if (row.estado == 1) {
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
                    grupo: row.id_grupoautorizacion,
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
        } else if (row.estado == 2) {
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
      width: '10%',
    },
  ])
  const tableData = {
    columns,
    data,
    filterPlaceholder: 'Filtrar datos',
    export: false,
    print: false,
  }
  if (session) {
    return (
      <DataTableExtensions {...tableData}>
        <DataTable
          columns={columns}
          noDataComponent="No hay pagos que mostrar"
          data={data}
          customStyles={customStyles}
          pagination
          paginationPerPage={25}
          responsive={true}
          persistTableHead
          striped={true}
          dense
        />
      </DataTableExtensions>
    )
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default Pendientes
