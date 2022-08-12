import React, { useState, useEffect, useMemo } from 'react'
import ReactDOM from 'react-dom'
import { useHistory, useLocation } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import DataTable, { defaultThemes } from 'react-data-table-component'
import { getLotesPago } from '../../../../services/getLotesPago'
import { useSession } from 'react-use-session'
import { FaRegFilePdf, FaRegFileExcel, FaList } from 'react-icons/fa'
import '../../../../scss/estilos.scss'
import DataTableExtensions from 'react-data-table-component-extensions'
import 'react-data-table-component-extensions/dist/index.css'
import { CButton } from '@coreui/react'

const LotesPago = (prop) => {
  const history = useHistory()
  const location = useLocation()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [LotesPago, setLotesPago] = useState([])
  const filteredItems = results
  const [mostrar, setMostrar] = useState(false)
  const [urlArchivo, setUrlArchivo] = useState('https://arxiv.org/pdf/quant-ph/0410100.pdf')

  const modalBody = () => (
    <div
      style={{
        background: 'rgba(0,0,0,0.7)',
        left: 0,
        position: 'fixed',
        top: 0,
        height: '100%',
        width: '100%',
        zIndex: 10001,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'scroll',
      }}
    >
      <div className="float-right" style={{ margin: '10px', textAlign: 'right' }}>
        <Button variant="danger" size="sm" onClick={() => setMostrar(false)}>
          Cerrar
        </Button>
      </div>
      <object data={urlArchivo} type="application/pdf" width="100%" height="100%">
        <p>
          Alternative text - include a link <a href={urlArchivo}>to the PDF!</a>
        </p>
      </object>
    </div>
  )

  useEffect(() => {
    let mounted = true
    if (location.tipo) {
      setLotesPago(location.LotesPago)
      getLotesPago(location.tipo, session.api_token).then((items) => {
        if (mounted) {
          setList(items.lotes)
        }
      })
    } else {
      getLotesPago(prop.tipo, session.api_token).then((items) => {
        if (mounted) {
          setList(items.lotes)
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
      name: 'Lote',
      selector: (row) => row.id_lotepago,
      center: true,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      wrap: true,
    },
    {
      name: 'Fecha',
      selector: (row) => row.fecha_hora,
      center: true,
      sortable: true,
      style: {
        fontSize: '11px',
      },
    },
    {
      name: 'Usuario',
      selector: (row) => row.nombre + ' ' + row.apellido,
      center: true,
      sortable: true,
      style: {
        fontSize: '11px',
      },
      wrap: true,
    },
    {
      name: 'Archivos',
      cell: function OrderItems(row) {
        return (
          <div>
            <Button
              variant="outline-danger"
              size="sm"
              title="Ver PDF"
              onClick={() => mostrarModal(row.id_lotepago)}
            >
              <FaRegFilePdf />
            </Button>{' '}
            <CButton
              variant="outline"
              size="sm"
              title="descargar XLSX"
              href={`${process.env.REACT_APP_URL}archivos/PagosLote${row.id_lotepago}.xlsx`}
            >
              <FaRegFileExcel />
            </CButton>
          </div>
        )
      },
      center: true,
    },
    /* {
      name: 'Acciones',
      cell: function OrderItems(row) {
        return (
          <div>
            <Button
              data-tag="allowRowEvents"
              variant="success"
              size="sm"
              title="Consultar Pagos"
              onClick={() =>
                history.push({
                  pathname: '/lote/pagos',
                  id_lotepago: row.id_lotepago,
                })
              }
            >
              <FaList />
            </Button>
          </div>
        )
      },
      center: true,
    }, */
  ])

  function mostrarModal(idPagoLote) {
    setUrlArchivo(`${process.env.REACT_APP_URL}archivos/PagosLote${idPagoLote}.pdf`)
    setMostrar(true)
  }

  function mostrarModalXLSX(idPagoLote) {
    setUrlArchivo(`${process.env.REACT_APP_URL}archivos/PagosLote${idPagoLote}.xlsx`)
  }

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
        {mostrar && ReactDOM.createPortal(modalBody(), document.body)}
        <div>
          <DataTableExtensions {...tableData}>
            <DataTable
              columns={columns}
              noDataComponent="No hay lotes que mostrar"
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

export default LotesPago
