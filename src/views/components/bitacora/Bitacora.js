import React, { useState, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { getSoporteBitacora } from '../../../services/getSoporteBitacora'
import { getPerfilUsuario } from '../../../services/getPerfilUsuario'
import { useSession } from 'react-use-session'
import { FaList, FaSearch } from 'react-icons/fa'
import '../../../scss/estilos.scss'
import { CButton } from '@coreui/react'
import DataTable, { defaultThemes } from 'react-data-table-component'
import DataTableExtensions from 'react-data-table-component-extensions'
import 'react-data-table-component-extensions/dist/index.css'
import 'react-datepicker/dist/react-datepicker.css'
import DatePicker, { registerLocale } from 'react-datepicker'

const Bitacora = () => {
  const history = useHistory()
  const { session, clear } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])
  const [inicio, setInicio] = useState('')
  const [final, setFinal] = useState('')

  useEffect(() => {
    let mounted = true
    let objeto = 'Modulo Bitacora'
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    let dateIniFormat = ''
    let dateFinFormat = ''
    if (
      sessionStorage.getItem('fechaBitacoraInicial') === null &&
      sessionStorage.getItem('fechaBitacoraFinal') === null
    ) {
      let dateIni = new Date()
      dateIni.setHours(dateIni.getHours() - 6)
      dateIniFormat = dateIni.toISOString().split('T')[0]
      let dateFin = new Date()
      dateFin.setHours(dateFin.getHours() - 6)
      dateFin.setDate(dateFin.getDate() + 1)
      dateFinFormat = dateFin.toISOString().split('T')[0]
      setInicio(dateIniFormat)
      sessionStorage.setItem('fechaBitacoraInicial', dateIniFormat)
      setFinal(dateFinFormat)
      sessionStorage.setItem('fechaBitacoraFinal', dateFinFormat)
    } else {
      setInicio(sessionStorage.getItem('fechaBitacoraInicial'))
      dateIniFormat = sessionStorage.getItem('fechaBitacoraInicial')
      setFinal(sessionStorage.getItem('fechaBitacoraFinal'))
      dateFinFormat = sessionStorage.getItem('fechaBitacoraFinal')
    }
    getSoporteBitacora(dateIniFormat, dateFinFormat, null).then((items) => {
      if (mounted) {
        setList(items.bitacora)
      }
    })
    getPerfilUsuario(idUsuario, '2', objeto).then((items) => {
      if (mounted) {
        setPermisos(items.detalle)
      }
    })
    return () => (mounted = false)
  }, [])

  async function Buscar() {
    await getSoporteBitacora(inicio, final, null).then((items) => {
      setList(items.bitacora)
    })
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
  const columns = useMemo(() => [
    {
      name: 'Usuario',
      selector: (row) => row.nombre_usuario,
      center: true,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      wrap: true,
    },
    {
      name: 'Nombre',
      selector: (row) => row.nombre + ' ' + row.apellido,
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
      style: {
        fontSize: '11px',
      },
      sortable: true,
    },
    {
      name: 'Acción',
      selector: (row) => row.accion,
      center: true,
      style: {
        fontSize: '11px',
      },
      sortable: true,
    },
    {
      name: 'Objeto',
      selector: (row) => row.objeto,
      center: true,
      style: {
        fontSize: '11px',
      },
      sortable: true,
    },
    {
      name: 'Acciones',
      cell: function OrderItems(row) {
        return (
          <div>
            <CButton
              color="primary"
              size="sm"
              title="Detalle"
              onClick={() =>
                history.push({
                  pathname: '/detallebitacora',
                  id_bitacora: row.id_bitacora,
                })
              }
            >
              <FaList />
            </CButton>
          </div>
        )
      },
      center: true,
      width: '200px',
    },
  ])

  const tableData = {
    columns,
    data: results,
    filterPlaceholder: 'Filtrar datos',
    export: false,
    print: false,
  }

  function registrarInicio(fecha) {
    setInicio(fecha)
    sessionStorage.setItem('fechaBitacoraInicial', fecha)
  }

  function registrarFinal(fecha) {
    setFinal(fecha)
    sessionStorage.setItem('fechaBitacoraFinal', fecha)
  }

  if (session) {
    return (
      <>
        <div
          style={{ display: 'flex', gap: '10px', flexDirection: 'row', justifyContent: 'flex-end' }}
        >
          De:
          <input
            defaultValue={inicio}
            type="date"
            onChange={(e) => {
              registrarInicio(e.target.value)
            }}
          />
          A:
          <input
            defaultValue={final}
            type="date"
            onChange={(e) => {
              registrarFinal(e.target.value)
            }}
          />{' '}
          <CButton color="primary" size="sm" title="Buscar" onClick={Buscar}>
            <FaSearch />
          </CButton>
        </div>
        <DataTableExtensions {...tableData}>
          <DataTable
            columns={columns}
            noDataComponent="No hay registros que mostrar"
            data={results}
            customStyles={customStyles}
            pagination
            paginationPerPage={25}
            responsive={true}
            persistTableHead
            striped={true}
            dense
          />
        </DataTableExtensions>
      </>
    )
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default Bitacora
