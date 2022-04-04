import React, { useState, useEffect, useMemo } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import { getSesionUsuario } from '../../../../services/getSesionUsuario'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { useSession } from 'react-use-session'
import '../../../../scss/estilos.scss'
import { CButton } from '@coreui/react'
import { FaArrowLeft } from 'react-icons/fa'
import DataTable, { defaultThemes } from 'react-data-table-component'
import DataTableExtensions from 'react-data-table-component-extensions'
import 'react-data-table-component-extensions/dist/index.css'

const Historico = () => {
  const history = useHistory()
  const location = useLocation()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [results, setList] = useState([])
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    let mounted = true
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    if (location.IdUsuario) {
      idUsuario = location.IdUsuario
    }
    getSesionUsuario(location.IdUsuario).then((items) => {
      if (mounted) {
        setList(items.sesiones)
      }
    })
    return () => (mounted = false)
  }, [])

  async function Cancelar(opcion) {
    if (opcion == 1) {
      setShow(false)
    } else if (opcion == 2) {
      let idUsuario = 0
      if (session) {
        idUsuario = session.id
      }
      const respuesta = await postSesionUsuario(idUsuario, null, null, '2')
      if (respuesta === 'OK') {
        clear()
        history.push('/')
      }
    }
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
      name: 'Navegador',
      selector: (row) => row.Navegador,
      center: true,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      wrap: true,
    },
    {
      name: 'IP Usuario',
      selector: (row) => row.IPAddress,
      center: true,
      style: {
        fontSize: '11px',
      },
      sortable: true,
    },
    {
      name: 'Inicio Sesión',
      selector: (row) => row.FechaHoraInicio,
      center: true,
      sortable: true,
      style: {
        fontSize: '11px',
      },
    },
    {
      name: 'Fin Sesión',
      selector: (row) => row.FechaHoraFinal,
      center: true,
      sortable: true,
      style: {
        fontSize: '11px',
      },
      wrap: true,
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
    if (location.IdUsuario) {
      return (
        <>
          <Modal responsive variant="primary" show={show} onHide={() => Cancelar(2)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Confirmación</Modal.Title>
            </Modal.Header>
            <Modal.Body>{mensaje}</Modal.Body>
            <Modal.Footer>
              <CButton color="secondary" onClick={() => Cancelar(2)}>
                Cancelar
              </CButton>
              <CButton color="primary" onClick={() => Cancelar(1)}>
                Aceptar
              </CButton>
            </Modal.Footer>
          </Modal>
          <div className="float-left" style={{ marginBottom: '10px' }}>
            <Button variant="primary" size="sm" onClick={() => history.goBack()}>
              <FaArrowLeft />
              &nbsp;&nbsp;Regresar
            </Button>
          </div>
          <br />
          <br />
          <div className="user-name-profile">{location.NombreUsuario}</div>
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
      history.push('/conectados')
      return (
        <div className="sin-sesion">
          NO SE CARGÓ EL CÓDIGO DEL USUARIO. REGRESE A LA PANTALLA DE USUARIOS.
        </div>
      )
    }
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default Historico
