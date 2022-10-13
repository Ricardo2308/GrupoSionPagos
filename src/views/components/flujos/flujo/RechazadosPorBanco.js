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
import { getOcultarColumnaUsuario } from '../../../../services/getOcultarColumnaUsuario'

const RechazadosPorBanco = (prop) => {
  const history = useHistory()
  const location = useLocation()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [camposOcultos, setListOcultos] = useState([])
  const [anchoConcepto, setAnchoConcepto] = useState('285px')
  const filteredItems = results
  const OrdenarPorColumna = sessionStorage.getItem('OrdenarPorColumnaRPB' + prop.tipo)
  const OrdenarPorDireccion = sessionStorage.getItem('OrdenarPorDireccionRPB' + prop.tipo)

  useEffect(() => {
    let mounted = true
    if (location.comentarios && location.tipo) {
      getRechazadosBanco(location.tipo, session.id, session.api_token).then((items) => {
        if (mounted) {
          setList(items.flujos)
        }
      })
      getOcultarColumnaUsuario(session.id, session.api_token).then((items) => {
        if (mounted) {
          setListOcultos(items.ocultar)
          if (items.ocultar.length > 0) {
            setAnchoConcepto('auto')
          } else {
            setAnchoConcepto('285px')
          }
        }
      })
    } else {
      getRechazadosBanco(prop.tipo, session.id, session.api_token).then((items) => {
        if (mounted) {
          setList(items.flujos)
        }
      })
      getOcultarColumnaUsuario(session.id, session.api_token).then((items) => {
        if (mounted) {
          setListOcultos(items.ocultar)
          if (items.ocultar.length > 0) {
            setAnchoConcepto('auto')
          } else {
            setAnchoConcepto('285px')
          }
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

  function OcultarCampo(campo) {
    let result = false
    for (let item of camposOcultos) {
      if (campo == item.NombreColumna) {
        result = true
      }
    }
    return result
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

  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: 'TODOS',
  }

  const columns = useMemo(() => [
    {
      id: 'Empresa',
      name: 'Empresa',
      selector: (row) => row.empresa_nombre,
      center: false,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      wrap: true,
      width: '150px',
      omit: OcultarCampo('Empresa'),
    },
    {
      id: 'No.',
      name: 'No.',
      selector: (row) => row.doc_num,
      center: false,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      width: '90px',
      omit: OcultarCampo('No. documento'),
    },
    {
      id: 'Fecha Sis.',
      name: 'Fecha Sis.',
      selector: (row) => row.creation_date,
      center: false,
      sortable: true,
      style: {
        fontSize: '11px',
      },
      width: '100px',
      omit: OcultarCampo('Fecha sistema'),
    },
    {
      id: 'Fecha auto.',
      name: 'Fecha auto.',
      selector: (row) => row.aut_date,
      center: false,
      sortable: true,
      style: {
        fontSize: '11px',
      },
      width: '100px',
      omit: OcultarCampo('Fecha autorización'),
    },
    {
      name: 'Beneficiario',
      name: 'Beneficiario',
      selector: (row) => row.en_favor_de,
      center: false,
      sortable: true,
      style: {
        fontSize: '11px',
      },
      wrap: true,
      width: '250px',
      omit: OcultarCampo('Beneficiario'),
    },
    {
      id: 'Concepto',
      name: 'Concepto',
      selector: (row) => row.comments,
      center: false,
      sortable: true,
      style: {
        fontSize: '11px',
      },
      wrap: true,
      width: anchoConcepto,
      omit: OcultarCampo('Concepto'),
    },
    {
      id: 'Monto',
      name: 'Monto',
      selector: (row) => row.doc_total,
      cell: (row) => formatear(row.doc_total, row.doc_curr),
      right: true,
      sortable: true,
      style: {
        fontSize: '11px',
      },
      width: '120px',
      omit: OcultarCampo('Monto'),
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
      omit: OcultarCampo('Acciones'),
    },
  ])
  const tableData = {
    columns: columns,
    data: filteredItems,
    filterPlaceholder: 'Filtrar datos',
    export: false,
    print: false,
  }
  function Ordenamiento(columna, direccion, e) {
    if (columna.name !== undefined) {
      sessionStorage.setItem('OrdenarPorColumnaRPB' + prop.tipo, columna.name)
    }
    if (direccion) {
      sessionStorage.setItem('OrdenarPorDireccionRPB' + prop.tipo, direccion)
    }
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
              onSort={Ordenamiento}
              dense
              paginationRowsPerPageOptions={[25, 50, 100, 300]}
              paginationComponentOptions={paginationComponentOptions}
              defaultSortAsc={OrdenarPorDireccion == 'asc' ? true : false}
              defaultSortFieldId={OrdenarPorColumna}
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
