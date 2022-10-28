import React, { useState, useEffect, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import DataTable, { defaultThemes } from 'react-data-table-component'
import { getReasignacion } from 'src/services/getReasignacion'
import { useSession } from 'react-use-session'
import { FaList, FaFileUpload, FaFlag, FaRegEdit } from 'react-icons/fa'
import '../../../../scss/estilos.scss'
import DataTableExtensions from 'react-data-table-component-extensions'
import 'react-data-table-component-extensions/dist/index.css'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import styled from 'styled-components'
import { getOcultarColumnaUsuario } from '../../../../services/getOcultarColumnaUsuario'

const ListarReasignacion = (prop) => {
  const history = useHistory()
  const location = useLocation()
  const { session } = useSession('PendrogonIT-Session')
  const [data, setListdata] = useState([])
  const [permisos, setPermisos] = useState([])
  //Cambio recordatorio
  const [camposOcultos, setListOcultos] = useState([])
  const [anchoConcepto, setAnchoConcepto] = useState('285px')
  const OrdenarPorColumna = sessionStorage.getItem('OrdenarPorColumnaLR')
  const OrdenarPorDireccion = sessionStorage.getItem('OrdenarPorDireccionLR')

  useEffect(() => {
    let colorFiltro = 'NO'
    if (location.colorFiltro !== undefined) {
      colorFiltro = location.colorFiltro
    }
    let mounted = true
    let objeto = 'Modulo Consultor'
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getReasignacion(idUsuario, session.api_token).then((items) => {
      if (mounted) {
        if (OrdenarPorColumna !== null && OrdenarPorDireccion !== null) {
          if (OrdenarPorColumna == 'Empresa' && OrdenarPorDireccion == 'asc') {
            items.flujos.sort((a, b) =>
              a.empresa_nombre > b.empresa_nombre
                ? 1
                : b.empresa_nombre > a.empresa_nombre
                ? -1
                : 0,
            )
          }
          if (OrdenarPorColumna == 'Empresa' && OrdenarPorDireccion == 'desc') {
            items.flujos.sort((a, b) =>
              a.empresa_nombre > b.empresa_nombre
                ? -1
                : b.empresa_nombre > a.empresa_nombre
                ? 1
                : 0,
            )
          }
          if (OrdenarPorColumna == 'No.' && OrdenarPorDireccion == 'asc') {
            items.flujos.sort((a, b) =>
              a.doc_num > b.doc_num ? 1 : b.doc_num > a.doc_num ? -1 : 0,
            )
          }
          if (OrdenarPorColumna == 'No.' && OrdenarPorDireccion == 'desc') {
            items.flujos.sort((a, b) =>
              a.doc_num > b.doc_num ? -1 : b.doc_num > a.doc_num ? 1 : 0,
            )
          }
          if (OrdenarPorColumna == 'Fecha Sis.' && OrdenarPorDireccion == 'asc') {
            items.flujos.sort((a, b) =>
              a.creation_date > b.creation_date ? 1 : b.creation_date > a.creation_date ? -1 : 0,
            )
          }
          if (OrdenarPorColumna == 'Fecha Sis.' && OrdenarPorDireccion == 'desc') {
            items.flujos.sort((a, b) =>
              a.creation_date > b.creation_date ? -1 : b.creation_date > a.creation_date ? 1 : 0,
            )
          }
          if (OrdenarPorColumna == 'Beneficiario' && OrdenarPorDireccion == 'asc') {
            items.flujos.sort((a, b) =>
              a.en_favor_de > b.en_favor_de ? 1 : b.en_favor_de > a.en_favor_de ? -1 : 0,
            )
          }
          if (OrdenarPorColumna == 'Beneficiario' && OrdenarPorDireccion == 'desc') {
            items.flujos.sort((a, b) =>
              a.en_favor_de > b.en_favor_de ? -1 : b.en_favor_de > a.en_favor_de ? 1 : 0,
            )
          }
          if (OrdenarPorColumna == 'Concepto' && OrdenarPorDireccion == 'asc') {
            items.flujos.sort((a, b) =>
              a.comments > b.comments ? 1 : b.comments > a.comments ? -1 : 0,
            )
          }
          if (OrdenarPorColumna == 'Concepto' && OrdenarPorDireccion == 'desc') {
            items.flujos.sort((a, b) =>
              a.comments > b.comments ? -1 : b.comments > a.comments ? 1 : 0,
            )
          }
          if (OrdenarPorColumna == 'Monto' && OrdenarPorDireccion == 'asc') {
            items.flujos.sort((a, b) =>
              parseFloat(a.doc_total) > parseFloat(b.doc_total)
                ? 1
                : parseFloat(b.doc_total) > parseFloat(a.doc_total)
                ? -1
                : 0,
            )
          }
          if (OrdenarPorColumna == 'Monto' && OrdenarPorDireccion == 'desc') {
            items.flujos.sort((a, b) =>
              parseFloat(a.doc_total) > parseFloat(b.doc_total)
                ? -1
                : parseFloat(b.doc_total) > parseFloat(a.doc_total)
                ? 1
                : 0,
            )
          }
        }
        if (colorFiltro === 'NO') {
          setListdata(items.flujos)
        } else {
          setListdata(
            items.flujos.filter(function (pago) {
              return pago.colorSemaforo == colorFiltro
            }),
          )
        }
        let datosOrdenados = []
        items.flujos.forEach((item) => {
          if (colorFiltro === 'NO') {
            datosOrdenados.push({
              id_flujo: item.id_flujo,
              estado: item.estado,
              nivel: item.nivel,
              id_grupo: item.id_grupoautorizacion,
              PuedoAutorizar: item.PuedoAutorizar,
              pago: item.doc_num,
              seccion: 'Pendientes',
            })
          } else {
            if (item.colorSemaforo == colorFiltro) {
              datosOrdenados.push({
                id_flujo: item.id_flujo,
                estado: item.estado,
                nivel: item.nivel,
                id_grupo: item.id_grupoautorizacion,
                PuedoAutorizar: item.PuedoAutorizar,
                pago: item.doc_num,
                seccion: 'Pendientes',
              })
            }
          }
        })
        sessionStorage.setItem('ConsultorPagosPendientes', JSON.stringify(datosOrdenados))
      }
    })
    getPerfilUsuario(session.id, '4', objeto, session.api_token).then((items) => {
      if (mounted) {
        setPermisos(items.detalle)
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
    return () => (mounted = false)
  }, [])

  function OcultarCampo(campo) {
    let result = false
    for (let item of camposOcultos) {
      if (campo == item.NombreColumna) {
        result = true
      }
    }
    return result
  }

  function ExistePermiso(permiso) {
    let result = false
    for (let item of permisos) {
      if (permiso == item.descripcion) {
        result = true
      }
    }
    return result
  }

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

  function estaChequeado(item) {
    return sessionStorage.getItem(item) === 'true'
  }

  const handleInput = (event) => {
    if (event.target.checked) {
      sessionStorage.setItem(event.target.value, 'true')
    } else {
      sessionStorage.setItem(event.target.value, 'false')
    }
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
      id: 'Tipo',
      selector: (row) => row.tipo,
      center: false,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      width: '90px',
      omit: OcultarCampo('Tipo'),
    },
    {
      name: 'Grupo actual',
      selector: (row) => row.nombre_grupo,
      center: false,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      width: '110px',
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
                  pathname: '/reasignacioncambio',
                  id_flujo: row.id_flujo,
                  pago: row.doc_num,
                  estado: row.estado,
                  nivel: row.nivel,
                  id_grupo: row.id_grupoautorizacion,
                  grupoActual: row.nombre_grupo,
                  PuedoAutorizar: row.PuedoAutorizar,
                  pagina: 'transferencia',
                  seccion: 'Pendientes',
                })
              }
            >
              <FaRegEdit />
            </Button>
          </div>
        )
      },
      center: true,
      width: '125px',
      omit: OcultarCampo('Acciones'),
    },
  ])
  const tableData = {
    columns,
    data,
    filterPlaceholder: 'Filtrar datos',
    export: false,
    print: false,
  }

  function Ordenamiento(columna, direccion, e) {
    if (columna.name !== undefined) {
      sessionStorage.setItem('OrdenarPorColumnaLR', columna.name)
    }
    if (direccion) {
      sessionStorage.setItem('OrdenarPorDireccionLR', direccion)
    }
    if (columna.name == 'Empresa' && direccion == 'asc') {
      data.sort(function (a, b) {
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
      data.sort(function (a, b) {
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
      data.sort(function (a, b) {
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
      data.sort(function (a, b) {
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
      data.sort(function (a, b) {
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
      data.sort(function (a, b) {
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
      data.sort(function (a, b) {
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
      data.sort(function (a, b) {
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
      data.sort(function (a, b) {
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
      data.sort(function (a, b) {
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
      data.sort(function (a, b) {
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
      data.sort(function (a, b) {
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
    data.forEach((item) => {
      datosOrdenados.push({
        id_flujo: item.id_flujo,
        estado: item.estado,
        nivel: item.nivel,
        id_grupo: item.id_grupoautorizacion,
        PuedoAutorizar: item.PuedoAutorizar,
        pago: item.doc_num,
        seccion: 'Pendientes',
      })
    })
    sessionStorage.setItem('ConsultorPagosPendientes', JSON.stringify(datosOrdenados))
    return true
  }

  if (session) {
    return (
      <>
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
            onSort={Ordenamiento}
            dense
            paginationRowsPerPageOptions={[25, 50, 100, 300]}
            paginationComponentOptions={paginationComponentOptions}
            defaultSortAsc={OrdenarPorDireccion == 'asc' ? true : false}
            defaultSortFieldId={OrdenarPorColumna}
          />
        </DataTableExtensions>
      </>
    )
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default ListarReasignacion
