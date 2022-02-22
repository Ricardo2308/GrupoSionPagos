import React, { useMemo } from 'react'
import DataTable, { createTheme } from 'react-data-table-component'
import { useSession } from 'react-use-session'
import { useHistory } from 'react-router-dom'
import '../../../../scss/estilos.scss'

const FlujoIngreso = (prop) => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')

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
      selector: (row) => row.doc_num,
      center: true,
      width: '140px',
    },
    {
      name: 'Fecha Impuesto',
      selector: (row) => row.tax_date,
      center: true,
      width: '140px',
    },
    {
      name: 'Fecha Documento',
      selector: (row) => row.doc_date,
      center: true,
      width: '140px',
    },
    {
      name: 'Nombre WHS',
      selector: (row) => row.whs_name,
      center: true,
      width: '400px',
    },
    {
      name: 'Usuario',
      selector: (row) => row.user,
      center: true,
      width: '250px',
    },
    {
      name: 'Código Item',
      selector: (row) => row.item_code,
      center: true,
      width: '100px',
    },
    {
      name: 'Código UOM',
      selector: (row) => row.uom_code,
      center: true,
      width: '100px',
    },
    {
      name: 'Cantidad',
      selector: (row) => row.quantity,
      center: true,
      width: '100px',
    },
    {
      name: 'Descripción',
      selector: (row) => row.dscription,
      center: true,
      width: '610px',
    },
    {
      name: 'Comentarios',
      selector: (row) => row.comments,
      center: true,
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
      return <div className="sin-array">AÚN NO EXISTE UN INGRESO A BODEGA.</div>
    }
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default FlujoIngreso
