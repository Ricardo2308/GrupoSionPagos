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
      selector: 'docu_num',
      center: true,
      width: '140px',
    },
    {
      name: 'Fecha Impuesto',
      selector: 'tax_date',
      center: true,
      width: '140px',
    },
    {
      name: 'Fecha Documento',
      selector: 'doc_date',
      center: true,
      width: '140px',
    },
    {
      name: 'Código Tarjeta',
      selector: 'card_code',
      center: true,
      width: '140px',
    },
    {
      name: 'Nombre Tarjeta',
      selector: 'card_name',
      center: true,
      width: '500px',
    },
    {
      name: 'Nit Factura',
      selector: 'fac_nit',
      center: true,
      width: '130px',
    },
    {
      name: 'Teléfono',
      selector: 'phone1',
      center: true,
      width: '100px',
    },
    {
      name: 'Término Pago',
      selector: 'termino_pago',
      center: true,
      width: '100px',
    },
    {
      name: 'Dirección',
      selector: 'address',
      center: true,
      width: '620px',
    },
    {
      name: 'Usuario',
      selector: 'user',
      center: true,
      width: '200px',
    },
    {
      name: 'Código Item',
      selector: 'item_code',
      center: true,
      width: '140px',
    },
    {
      name: 'Precio',
      selector: 'price',
      center: true,
      width: '100px',
    },
    {
      name: 'Cantidad',
      selector: 'quantity',
      center: true,
      width: '100px',
    },
    {
      name: 'Línea Total',
      selector: 'line_total',
      center: true,
      width: '100px',
    },
    {
      name: 'Total Documento',
      selector: 'doc_total',
      center: true,
      width: '140px',
    },
    {
      name: 'Comentario',
      selector: 'comment',
      center: true,
    },
    {
      name: 'Creación Usuario',
      selector: 'crea_usuario',
      center: true,
      width: '140px',
    },
    {
      name: 'Creación Fecha',
      selector: 'crea_fecha',
      center: true,
      width: '140px',
    },
    {
      name: 'Autorización Usuario',
      selector: 'autoriza_usuario',
      center: true,
      width: '140px',
    },
    {
      name: 'Autorización Fecha',
      selector: 'autoriza_fecha',
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
