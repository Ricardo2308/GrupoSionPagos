import React, { useState, useEffect, useMemo } from 'react'
import { Modal } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useIdleTimer } from 'react-idle-timer'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { getSesionUsuario } from '../../../../services/getSesionUsuario'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { useSession } from 'react-use-session'
import { FaList } from 'react-icons/fa'
import '../../../../scss/estilos.scss'
import {
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import DataTable, { defaultThemes } from 'react-data-table-component'
import DataTableExtensions from 'react-data-table-component-extensions'
import 'react-data-table-component-extensions/dist/index.css'

const Conectados = () => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])
  const [show, setShow] = useState(false)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    let mounted = true
    let objeto = 'Modulo Conectados'
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getSesionUsuario(null, session.api_token).then((items) => {
      if (mounted) {
        setList(items.sesiones)
      }
    })
    getPerfilUsuario(idUsuario, '2', objeto, session.api_token).then((items) => {
      if (mounted) {
        setPermisos(items.detalle)
      }
    })
    return () => (mounted = false)
  }, [])

  function ExistePermiso(objeto) {
    let result = false
    for (let item of permisos) {
      if (objeto === item.objeto) {
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
  const columns = useMemo(() => [
    {
      name: 'Usuario',
      selector: (row) => row.NombreUsuario,
      center: true,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      wrap: true,
    },
    {
      name: 'IP',
      selector: (row) => row.IPAddress,
      center: true,
      style: {
        fontSize: '11px',
      },
      sortable: true,
    },
    {
      name: 'Navegador',
      selector: (row) => row.Navegador,
      center: true,
      sortable: true,
      style: {
        fontSize: '11px',
      },
    },
    {
      name: 'Hora Inicio',
      selector: (row) => row.FechaHoraInicio,
      center: true,
      sortable: true,
      style: {
        fontSize: '11px',
      },
      wrap: true,
    },
    {
      name: 'Acciones',
      cell: function OrderItems(row) {
        let deshabilitar = false
        if (!ExistePermiso('Modulo Conectados')) {
          deshabilitar = true
        }
        return (
          <div>
            <CButton
              color="primary"
              size="sm"
              title="Histórico Usuario"
              disabled={deshabilitar}
              onClick={() =>
                history.push({
                  pathname: '/conectados/historico',
                  IdUsuario: row.IdUsuario,
                  NombreUsuario: row.NombreUsuario,
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

  if (session) {
    let deshabilitar = false
    if (!ExistePermiso('Modulo Conectados')) {
      deshabilitar = true
    }
    return (
      <>
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
            paginationRowsPerPageOptions={[25, 50, 100, 300]}
          />
        </DataTableExtensions>
      </>
    )
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default Conectados
