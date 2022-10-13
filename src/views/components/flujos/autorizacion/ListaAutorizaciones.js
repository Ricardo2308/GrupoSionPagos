import React, { useState, useEffect, useMemo } from 'react'
import { Modal } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { getUsuarioAutorizacion } from '../../../../services/getUsuarioAutorizacion'
import { postUsuarioAutorizacion } from '../../../../services/postUsuarioAutorizacion'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { useSession } from 'react-use-session'
import { useHistory } from 'react-router-dom'
import { BsToggles } from 'react-icons/bs'
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

const ListaAutorizaciones = () => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])
  const [show, setShow] = useState(false)
  const [idAutorizacion, setidAutorizacion] = useState(0)
  const [estado, setEstado] = useState(0)
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')
  const [desactivarBotonModal, setDesactivarBotonModal] = useState(false)

  useEffect(() => {
    let mounted = true
    let objeto = 'Modulo Autorizacion'
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getUsuarioAutorizacion(idUsuario, null, session.api_token).then((items) => {
      if (mounted) {
        setList(items.autorizacion)
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
    let result = 0
    for (let item of permisos) {
      if (objeto === item.objeto) {
        result = 1
      }
    }
    return result
  }

  async function Cancelar(opcion) {
    if (opcion == 1) {
      setShow(false)
    } else if (opcion == 2) {
      let idUsuario = 0
      if (session) {
        idUsuario = session.id
      }
      const respuesta = await postSesionUsuario(idUsuario, null, null, '2', session.api_token)
      if (respuesta === 'OK') {
        clear()
        history.push('/')
      }
    }
  }

  function mostrarModal(id_autorizacion, opcion, estado) {
    setidAutorizacion(id_autorizacion)
    setEstado(estado)
    setOpcion(opcion)
    setShow(true)
    setMensaje('Está seguro de cambiar el estado de la autorización de encargado temporal?')
  }

  async function cambiarEstado(id_autorizacion, opcion, estado) {
    setDesactivarBotonModal(true)
    if (opcion == 1) {
      let result
      if (estado == 0) {
        result = '1'
      } else {
        result = '0'
      }
      const respuesta = await postUsuarioAutorizacion(
        id_autorizacion,
        '',
        '',
        '',
        '',
        opcion,
        result,
        session.id,
        session.api_token,
      )
      if (respuesta === 'OK') {
        await getUsuarioAutorizacion(session.id, null, session.api_token).then((items) => {
          setList(items.autorizacion)
        })
      }
    } else if (opcion == 2) {
      setShow(false)
    }
    setDesactivarBotonModal(false)
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

  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: 'TODOS',
  }

  const columns = useMemo(() => [
    {
      name: 'Usuario Temporal',
      selector: (row) => row.usuariotemporal,
      center: false,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      wrap: true,
    },
    {
      name: 'Fecha inico',
      selector: (row) => row.fecha_inicio,
      center: false,
      style: {
        fontSize: '11px',
      },
      sortable: true,
    },
    {
      name: 'Fecha final',
      selector: (row) => row.fecha_final,
      center: false,
      sortable: true,
      style: {
        fontSize: '11px',
      },
    },
    {
      name: 'Estado',
      cell: function OrderItems(row) {
        let estado = 'Inactivo'
        if (row.activo == 1) {
          estado = 'Activo'
        }
        return estado
      },
      center: false,
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
        if (!ExistePermiso('Modulo Usuarios')) {
          deshabilitar = true
        }
        return (
          <div>
            <CButton
              color="info"
              size="sm"
              title="Cambiar Estado"
              //disabled={deshabilitar}
              onClick={() => mostrarModal(row.id_usuarioautorizacion, 1, row.activo)}
            >
              <BsToggles />
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
    if (ExistePermiso('Modulo Autorizacion') == 0) {
      deshabilitar = true
    }
    return (
      <>
        <Modal responsive variant="primary" show={show} onHide={() => Cancelar(opcion)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación</Modal.Title>
          </Modal.Header>
          <Modal.Body>{mensaje}</Modal.Body>
          <Modal.Footer>
            <CButton color="secondary" onClick={() => Cancelar(opcion)}>
              Cancelar
            </CButton>
            <CButton
              disabled={desactivarBotonModal}
              color="primary"
              onClick={() => cambiarEstado(idAutorizacion, opcion, estado).then(() => Cancelar(1))}
            >
              Aceptar
            </CButton>
          </Modal.Footer>
        </Modal>
        <div className="float-right" style={{ marginBottom: '10px' }}>
          <CButton
            color="primary"
            size="sm"
            //disabled={deshabilitar}
            onClick={() =>
              history.push({
                pathname: '/autorizacion/nueva',
                id_usuario: session.id,
              })
            }
          >
            Crear Nueva
          </CButton>
        </div>
        <DataTableExtensions {...tableData}>
          <DataTable
            columns={columns}
            noDataComponent="No hay usuarios que mostrar"
            data={results}
            customStyles={customStyles}
            pagination
            paginationPerPage={25}
            responsive={true}
            persistTableHead
            striped={true}
            dense
            paginationRowsPerPageOptions={[25, 50, 100, 300]}
            paginationComponentOptions={paginationComponentOptions}
          />
        </DataTableExtensions>
      </>
    )
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default ListaAutorizaciones
