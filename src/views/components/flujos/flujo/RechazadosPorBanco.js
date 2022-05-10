import React, { useState, useEffect, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import DataTable, { defaultThemes } from 'react-data-table-component'
import { getRechazadosBanco } from '../../../../services/getRechazadosBanco'
import { useSession } from 'react-use-session'
import { FaList } from 'react-icons/fa'
import '../../../../scss/estilos.scss'
import DataTableExtensions from 'react-data-table-component-extensions'
import 'react-data-table-component-extensions/dist/index.css'

const RechazadosPorBanco = (prop) => {
  const history = useHistory()
  const location = useLocation()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const filteredItems = results

  useEffect(() => {
    let mounted = true
    if (location.comentarios && location.tipo) {
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
      width: '150px',
    },
    {
      name: 'No.',
      selector: (row) => row.doc_num,
      center: true,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      width: '90px',
    },
    {
      name: 'Fecha Sis.',
      selector: (row) => row.creation_date,
      center: true,
      sortable: true,
      style: {
        fontSize: '11px',
      },
      width: '100px',
    },
    {
      name: 'Fecha auto.',
      selector: (row) => row.aut_date,
      center: true,
      sortable: true,
      style: {
        fontSize: '11px',
      },
      width: '100px',
    },
    {
      name: 'Beneficiario',
      selector: (row) => row.en_favor_de,
      center: true,
      sortable: true,
      style: {
        fontSize: '11px',
      },
      wrap: true,
      width: '250px',
    },
    {
      name: 'Concepto',
      selector: (row) => row.comments,
      center: true,
      style: {
        fontSize: '11px',
      },
      wrap: true,
      width: '285px',
    },
    {
      name: 'Monto',
      selector: (row) => formatear(row.doc_total, row.doc_curr),
      center: true,
      style: {
        fontSize: '11px',
      },
      width: '120px',
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
                  pathname: '/compensacion/tabs',
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
      width: '70px',
    },
  ])
  const tableData = {
    columns: columns,
    data: filteredItems,
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

export default RechazadosPorBanco
