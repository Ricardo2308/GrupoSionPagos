import React, { useMemo } from 'react'
import DataTable, { createTheme } from 'react-data-table-component'
import { useSession } from 'react-use-session'
import { useHistory } from 'react-router-dom'
import '../../../../scss/estilos.scss'

const FlujoOrden = (prop) => {
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
      selector: (row) => row.docu_num,
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
      name: 'Código Tarjeta',
      selector: (row) => row.card_code,
      center: true,
      width: '140px',
    },
    {
      name: 'Nombre Tarjeta',
      selector: (row) => row.card_name,
      center: true,
      width: '500px',
    },
    {
      name: 'Nit Factura',
      selector: (row) => row.fac_nit,
      center: true,
      width: '130px',
    },
    {
      name: 'Teléfono',
      selector: (row) => row.phone1,
      center: true,
      width: '100px',
    },
    {
      name: 'Término Pago',
      selector: (row) => row.termino_pago,
      center: true,
      width: '100px',
    },
    {
      name: 'Dirección',
      selector: (row) => row.address,
      center: true,
      width: '620px',
    },
    {
      name: 'Usuario',
      selector: (row) => row.user,
      center: true,
      width: '200px',
    },
    {
      name: 'Código Item',
      selector: (row) => row.item_code,
      center: true,
      width: '140px',
    },
    {
      name: 'Precio',
      selector: (row) => row.price,
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
      name: 'Línea Total',
      selector: (row) => row.line_total,
      center: true,
      width: '100px',
    },
    {
      name: 'Total Documento',
      selector: (row) => row.doc_total,
      center: true,
      width: '140px',
    },
    {
      name: 'Comentario',
      selector: (row) => row.comment,
      center: true,
    },
    {
      name: 'Creación Usuario',
      selector: (row) => row.crea_usuario,
      center: true,
      width: '140px',
    },
    {
      name: 'Creación Fecha',
      selector: (row) => row.crea_fecha,
      center: true,
      width: '140px',
    },
    {
      name: 'Autorización Usuario',
      selector: (row) => row.autoriza_usuario,
      center: true,
      width: '140px',
    },
    {
      name: 'Autorización Fecha',
      selector: (row) => row.autoriza_fecha,
      center: true,
      width: '140px',
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
      return <div className="sin-array">AÚN NO EXISTE ORDEN DE COMPRA.</div>
    }
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default FlujoOrden
