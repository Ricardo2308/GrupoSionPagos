import React, { useMemo } from 'react'
import DataTable, { createTheme } from 'react-data-table-component'
import { useSession } from 'react-use-session'
import { useHistory } from 'react-router-dom'
import '../../../../scss/estilos.scss'

const FlujoSolicitud = (prop) => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')

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

  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: 'TODOS',
  }

  const columns = useMemo(() => [
    {
      name: 'Número Documento',
      selector: (row) => row.doc_num,
      center: false,
      width: '140px',
    },
    {
      name: 'Nombre',
      selector: (row) => row.req_name,
      center: false,
      width: '180px',
    },
    {
      name: 'Código Item',
      selector: (row) => row.item_code,
      center: false,
      width: '140px',
    },
    {
      name: 'Descripción',
      selector: (row) => row.description,
      center: false,
    },
    {
      name: 'Código UOM',
      selector: (row) => row.uom_code,
      center: false,
      width: '140px',
    },
    {
      name: 'Precio',
      selector: (row) => row.price,
      center: false,
      width: '100px',
    },
    {
      name: 'Cantidad',
      selector: (row) => row.quantity,
      center: false,
      width: '100px',
    },
    {
      name: 'Unidades Totales',
      selector: (row) => row.unidades_totales,
      center: false,
      width: '150px',
    },
    {
      name: 'Unidades por Caja',
      selector: (row) => row.unidades_por_caja,
      center: false,
      width: '150px',
    },
    {
      name: 'Comentarios',
      selector: (row) => row.comments,
      center: false,
      width: '100px',
    },
    {
      name: 'Autorizador 1',
      selector: (row) => row.autorizador1,
      center: false,
      width: '100px',
    },
    {
      name: 'Autorizador 2',
      selector: (row) => row.autorizador2,
      center: false,
      width: '100px',
    },
    {
      name: 'Autorizador 3',
      selector: (row) => row.autorizador3,
      center: false,
      width: '100px',
    },
    {
      name: 'Fecha Autorización 1',
      selector: (row) => row.fecha_aut1,
      center: false,
      width: '150px',
    },
    {
      name: 'Fecha Autorización 2',
      selector: (row) => row.fecha_aut2,
      center: false,
      width: '150px',
    },
    {
      name: 'Fecha Autorización 3',
      selector: (row) => row.fecha_aut3,
      center: false,
      width: '150px',
    },
  ])

  if (session) {
    if (prop.results) {
      return (
        <DataTable
          columns={columns}
          data={prop.results}
          noDataComponent="No hay ingresos a bodega que mostrar"
          customStyles={customStyles}
          theme="solarized"
          pagination
          paginationPerPage={5}
          responsive={true}
          persistTableHead
        />
      )
    } else {
      return <div className="sin-array">AÚN NO EXISTE SOLICITUD.</div>
    }
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default FlujoSolicitud
