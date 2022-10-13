import React, { useState, useEffect, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Button, FormControl } from 'react-bootstrap'
import DataTable, { createTheme, defaultThemes } from 'react-data-table-component'
import { getRechazados } from '../../../../services/getRechazados'
import { postNotificacion } from '../../../../services/postNotificacion'
import { useSession } from 'react-use-session'
import { FaList } from 'react-icons/fa'
import '../../../../scss/estilos.scss'
import DataTableExtensions from 'react-data-table-component-extensions'
import 'react-data-table-component-extensions/dist/index.css'
import { getOcultarColumnaUsuario } from '../../../../services/getOcultarColumnaUsuario'

const Rechazados = (prop) => {
  const history = useHistory()
  const location = useLocation()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [rechazados, setRechazados] = useState([])
  const [camposOcultos, setListOcultos] = useState([])
  const [anchoConcepto, setAnchoConcepto] = useState('285px')
  const filteredItems = results
  const filteredItemsR = rechazados
  const OrdenarPorColumna = sessionStorage.getItem('OrdenarPorColumnaRE' + prop.tipo)
  const OrdenarPorDireccion = sessionStorage.getItem('OrdenarPorDireccionRE' + prop.tipo)

  async function leerNotificaciones(IdFlujo, Pago, Estado, Nivel, IdGrupo) {
    let pagos = []
    pagos.push(IdFlujo)
    const respuesta = await postNotificacion(pagos, session.id, '', '1', session.api_token)
    if (respuesta == 'OK') {
      history.push({
        pathname: '/pagos/tabs',
        id_flujo: IdFlujo,
        pago: Pago,
        estado: Estado,
        nivel: Nivel,
        id_grupo: IdGrupo,
        PuedoAutorizar: '0',
        seccion: 'Rechazados',
      })
    }
  }

  useEffect(() => {
    let mounted = true
    if (location.tipo) {
      setRechazados(location.rechazados)
      getRechazados(session.id, location.tipo, session.api_token).then((items) => {
        if (mounted) {
          if (OrdenarPorColumna !== null && OrdenarPorDireccion !== null) {
            if (OrdenarPorColumna == 'Empresa' && OrdenarPorDireccion == 'asc') {
              items.bitacora.sort((a, b) =>
                a.empresa_nombre > b.empresa_nombre
                  ? 1
                  : b.empresa_nombre > a.empresa_nombre
                  ? -1
                  : 0,
              )
            }
            if (OrdenarPorColumna == 'Empresa' && OrdenarPorDireccion == 'desc') {
              items.bitacora.sort((a, b) =>
                a.empresa_nombre > b.empresa_nombre
                  ? -1
                  : b.empresa_nombre > a.empresa_nombre
                  ? 1
                  : 0,
              )
            }
            if (OrdenarPorColumna == 'No.' && OrdenarPorDireccion == 'asc') {
              items.bitacora.sort((a, b) =>
                a.doc_num > b.doc_num ? 1 : b.doc_num > a.doc_num ? -1 : 0,
              )
            }
            if (OrdenarPorColumna == 'No.' && OrdenarPorDireccion == 'desc') {
              items.bitacora.sort((a, b) =>
                a.doc_num > b.doc_num ? -1 : b.doc_num > a.doc_num ? 1 : 0,
              )
            }
            if (OrdenarPorColumna == 'Fecha Sis.' && OrdenarPorDireccion == 'asc') {
              items.bitacora.sort((a, b) =>
                a.creation_date > b.creation_date ? 1 : b.creation_date > a.creation_date ? -1 : 0,
              )
            }
            if (OrdenarPorColumna == 'Fecha Sis.' && OrdenarPorDireccion == 'desc') {
              items.bitacora.sort((a, b) =>
                a.creation_date > b.creation_date ? -1 : b.creation_date > a.creation_date ? 1 : 0,
              )
            }
            if (OrdenarPorColumna == 'Beneficiario' && OrdenarPorDireccion == 'asc') {
              items.bitacora.sort((a, b) =>
                a.en_favor_de > b.en_favor_de ? 1 : b.en_favor_de > a.en_favor_de ? -1 : 0,
              )
            }
            if (OrdenarPorColumna == 'Beneficiario' && OrdenarPorDireccion == 'desc') {
              items.bitacora.sort((a, b) =>
                a.en_favor_de > b.en_favor_de ? -1 : b.en_favor_de > a.en_favor_de ? 1 : 0,
              )
            }
            if (OrdenarPorColumna == 'Concepto' && OrdenarPorDireccion == 'asc') {
              items.bitacora.sort((a, b) =>
                a.comments > b.comments ? 1 : b.comments > a.comments ? -1 : 0,
              )
            }
            if (OrdenarPorColumna == 'Concepto' && OrdenarPorDireccion == 'desc') {
              items.bitacora.sort((a, b) =>
                a.comments > b.comments ? -1 : b.comments > a.comments ? 1 : 0,
              )
            }
            if (OrdenarPorColumna == 'Monto' && OrdenarPorDireccion == 'asc') {
              items.bitacora.sort((a, b) =>
                parseFloat(a.doc_total) > parseFloat(b.doc_total)
                  ? 1
                  : parseFloat(b.doc_total) > parseFloat(a.doc_total)
                  ? -1
                  : 0,
              )
            }
            if (OrdenarPorColumna == 'Monto' && OrdenarPorDireccion == 'desc') {
              items.bitacora.sort((a, b) =>
                parseFloat(a.doc_total) > parseFloat(b.doc_total)
                  ? -1
                  : parseFloat(b.doc_total) > parseFloat(a.doc_total)
                  ? 1
                  : 0,
              )
            }
          }
          setList(items.bitacora)
          let datosOrdenados = []
          items.bitacora.forEach((item) => {
            datosOrdenados.push({
              id_flujo: item.IdFlujo,
              estado: item.estado,
              nivel: item.nivel,
              id_grupo: item.id_grupoautorizacion,
              PuedoAutorizar: '0',
              pago: item.doc_num,
              seccion: 'Rechazados',
            })
          })
          sessionStorage.setItem('listaPagosRechazados', JSON.stringify(datosOrdenados))
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
      getRechazados(session.id, prop.tipo, session.api_token).then((items) => {
        if (mounted) {
          if (OrdenarPorColumna !== null && OrdenarPorDireccion !== null) {
            if (OrdenarPorColumna == 'Empresa' && OrdenarPorDireccion == 'asc') {
              items.bitacora.sort((a, b) =>
                a.empresa_nombre > b.empresa_nombre
                  ? 1
                  : b.empresa_nombre > a.empresa_nombre
                  ? -1
                  : 0,
              )
            }
            if (OrdenarPorColumna == 'Empresa' && OrdenarPorDireccion == 'desc') {
              items.bitacora.sort((a, b) =>
                a.empresa_nombre > b.empresa_nombre
                  ? -1
                  : b.empresa_nombre > a.empresa_nombre
                  ? 1
                  : 0,
              )
            }
            if (OrdenarPorColumna == 'No.' && OrdenarPorDireccion == 'asc') {
              items.bitacora.sort((a, b) =>
                a.doc_num > b.doc_num ? 1 : b.doc_num > a.doc_num ? -1 : 0,
              )
            }
            if (OrdenarPorColumna == 'No.' && OrdenarPorDireccion == 'desc') {
              items.bitacora.sort((a, b) =>
                a.doc_num > b.doc_num ? -1 : b.doc_num > a.doc_num ? 1 : 0,
              )
            }
            if (OrdenarPorColumna == 'Fecha Sis.' && OrdenarPorDireccion == 'asc') {
              items.bitacora.sort((a, b) =>
                a.creation_date > b.creation_date ? 1 : b.creation_date > a.creation_date ? -1 : 0,
              )
            }
            if (OrdenarPorColumna == 'Fecha Sis.' && OrdenarPorDireccion == 'desc') {
              items.bitacora.sort((a, b) =>
                a.creation_date > b.creation_date ? -1 : b.creation_date > a.creation_date ? 1 : 0,
              )
            }
            if (OrdenarPorColumna == 'Beneficiario' && OrdenarPorDireccion == 'asc') {
              items.bitacora.sort((a, b) =>
                a.en_favor_de > b.en_favor_de ? 1 : b.en_favor_de > a.en_favor_de ? -1 : 0,
              )
            }
            if (OrdenarPorColumna == 'Beneficiario' && OrdenarPorDireccion == 'desc') {
              items.bitacora.sort((a, b) =>
                a.en_favor_de > b.en_favor_de ? -1 : b.en_favor_de > a.en_favor_de ? 1 : 0,
              )
            }
            if (OrdenarPorColumna == 'Concepto' && OrdenarPorDireccion == 'asc') {
              items.bitacora.sort((a, b) =>
                a.comments > b.comments ? 1 : b.comments > a.comments ? -1 : 0,
              )
            }
            if (OrdenarPorColumna == 'Concepto' && OrdenarPorDireccion == 'desc') {
              items.bitacora.sort((a, b) =>
                a.comments > b.comments ? -1 : b.comments > a.comments ? 1 : 0,
              )
            }
            if (OrdenarPorColumna == 'Monto' && OrdenarPorDireccion == 'asc') {
              items.bitacora.sort((a, b) =>
                parseFloat(a.doc_total) > parseFloat(b.doc_total)
                  ? 1
                  : parseFloat(b.doc_total) > parseFloat(a.doc_total)
                  ? -1
                  : 0,
              )
            }
            if (OrdenarPorColumna == 'Monto' && OrdenarPorDireccion == 'desc') {
              items.bitacora.sort((a, b) =>
                parseFloat(a.doc_total) > parseFloat(b.doc_total)
                  ? -1
                  : parseFloat(b.doc_total) > parseFloat(a.doc_total)
                  ? 1
                  : 0,
              )
            }
          }
          setList(items.bitacora)
          let datosOrdenados = []
          items.bitacora.forEach((item) => {
            datosOrdenados.push({
              id_flujo: item.IdFlujo,
              estado: item.estado,
              nivel: item.nivel,
              id_grupo: item.id_grupoautorizacion,
              PuedoAutorizar: '0',
              pago: item.doc_num,
              seccion: 'Rechazados',
            })
          })
          sessionStorage.setItem('listaPagosRechazados', JSON.stringify(datosOrdenados))
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
      id: 'Beneficiario',
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
                  pathname: '/pagos/tabs',
                  id_flujo: row.IdFlujo,
                  pago: row.doc_num,
                  estado: row.estado,
                  nivel: row.nivel,
                  id_grupo: row.id_grupoautorizacion,
                  PuedoAutorizar: '0',
                  seccion: 'Rechazados',
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

  const columnsR = useMemo(() => [
    {
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
      name: 'No.',
      selector: (row) => row.Pago,
      center: false,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      width: '90px',
      omit: OcultarCampo('No. documento'),
    },
    {
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
      name: 'Tipo',
      selector: (row) => row.tipo,
      center: false,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      width: '123px',
      omit: OcultarCampo('Tipo'),
    },
    {
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
                leerNotificaciones(row.IdFlujo, row.Pago, row.IdGrupo, row.estado, row.nivel)
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
  const tableDataR = {
    columns: columnsR,
    data: filteredItemsR,
    filterPlaceholder: 'Filtrar datos',
    export: false,
    print: false,
  }

  function Ordenamiento(columna, direccion, e) {
    if (columna.name !== undefined) {
      sessionStorage.setItem('OrdenarPorColumnaRE' + prop.tipo, columna.name)
    }
    if (direccion) {
      sessionStorage.setItem('OrdenarPorDireccionRE' + prop.tipo, direccion)
    }
    if (columna.name == 'Empresa' && direccion == 'asc') {
      filteredItems.sort(function (a, b) {
        if (a.empresa_nombre > b.empresa_nombre) {
          return 1
        }
        if (a.empresa_nombre < b.empresa_nombre) {
          return -1
        }
        return 0
      })
    }
    if (columna.name == 'Empresa' && direccion == 'desc') {
      filteredItems.sort(function (a, b) {
        if (a.empresa_nombre > b.empresa_nombre) {
          return -1
        }
        if (a.empresa_nombre < b.empresa_nombre) {
          return 1
        }
        return 0
      })
    }
    if (columna.name == 'No.' && direccion == 'asc') {
      filteredItems.sort(function (a, b) {
        if (a.doc_num > b.doc_num) {
          return 1
        }
        if (a.doc_num < b.doc_num) {
          return -1
        }
        return 0
      })
    }
    if (columna.name == 'No.' && direccion == 'desc') {
      filteredItems.sort(function (a, b) {
        if (a.doc_num > b.doc_num) {
          return -1
        }
        if (a.doc_num < b.doc_num) {
          return 1
        }
        return 0
      })
    }
    if (columna.name == 'Fecha Sis.' && direccion == 'asc') {
      filteredItems.sort(function (a, b) {
        if (a.creation_date > b.creation_date) {
          return 1
        }
        if (a.creation_date < b.creation_date) {
          return -1
        }
        return 0
      })
    }
    if (columna.name == 'Fecha Sis.' && direccion == 'desc') {
      filteredItems.sort(function (a, b) {
        if (a.creation_date > b.creation_date) {
          return -1
        }
        if (a.creation_date < b.creation_date) {
          return 1
        }
        return 0
      })
    }
    if (columna.name == 'Beneficiario' && direccion == 'asc') {
      filteredItems.sort(function (a, b) {
        if (a.en_favor_de > b.en_favor_de) {
          return 1
        }
        if (a.en_favor_de < b.en_favor_de) {
          return -1
        }
        return 0
      })
    }
    if (columna.name == 'Beneficiario' && direccion == 'desc') {
      filteredItems.sort(function (a, b) {
        if (a.en_favor_de > b.en_favor_de) {
          return -1
        }
        if (a.en_favor_de < b.en_favor_de) {
          return 1
        }
        return 0
      })
    }
    if (columna.name == 'Concepto' && direccion == 'asc') {
      filteredItems.sort(function (a, b) {
        if (a.comments > b.comments) {
          return 1
        }
        if (a.comments < b.comments) {
          return -1
        }
        return 0
      })
    }
    if (columna.name == 'Concepto' && direccion == 'desc') {
      filteredItems.sort(function (a, b) {
        if (a.comments > b.comments) {
          return -1
        }
        if (a.comments < b.comments) {
          return 1
        }
        return 0
      })
    }
    if (columna.name == 'Monto' && direccion == 'asc') {
      filteredItems.sort(function (a, b) {
        if (parseFloat(a.doc_total) > parseFloat(b.doc_total)) {
          return 1
        }
        if (parseFloat(a.doc_total) < parseFloat(b.doc_total)) {
          return -1
        }
        return 0
      })
    }
    if (columna.name == 'Monto' && direccion == 'desc') {
      filteredItems.sort(function (a, b) {
        if (parseFloat(a.doc_total) > parseFloat(b.doc_total)) {
          return -1
        }
        if (parseFloat(a.doc_total) < parseFloat(b.doc_total)) {
          return 1
        }
        return 0
      })
    }
    let datosOrdenados = []
    filteredItems.forEach((item) => {
      datosOrdenados.push({
        id_flujo: item.IdFlujo,
        estado: item.estado,
        nivel: item.nivel,
        id_grupo: item.id_grupoautorizacion,
        PuedoAutorizar: '0',
        pago: item.doc_num,
        seccion: 'Rechazados',
      })
    })
    sessionStorage.setItem('listaPagosRechazados', JSON.stringify(datosOrdenados))
    return true
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
            <DataTableExtensions {...tableDataR}>
              <DataTable
                columns={columnsR}
                noDataComponent="No hay pagos que mostrar"
                data={filteredItemsR}
                customStyles={customStyles}
                pagination
                paginationPerPage={5}
                responsive={true}
                persistTableHead
                striped={true}
                dense
                paginationComponentOptions={paginationComponentOptions}
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

export default Rechazados
