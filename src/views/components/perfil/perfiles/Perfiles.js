import React, { useState, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { postCrudPerfil } from '../../../../services/postCrudPerfil'
import { getPerfiles } from '../../../../services/getPerfiles'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { Modal } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { useSession } from 'react-use-session'
import { FaUserEdit, FaTrash, FaUserCog, FaClipboardList } from 'react-icons/fa'
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

const Perfiles = () => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])
  const [show, setShow] = useState(false)
  const [idPerfil, setIdPerfil] = useState(0)
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')
  const [desactivarBotonModal, setDesactivarBotonModal] = useState(false)

  useEffect(() => {
    let mounted = true
    let objeto = 'Modulo Perfiles'
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getPerfiles(null, null, session.api_token).then((items) => {
      if (mounted) {
        setList(items.perfiles)
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

  function mostrarModal(id_perfil, nombre, opcion) {
    setIdPerfil(id_perfil)
    setOpcion(opcion)
    setMensaje('Está seguro de eliminar el perfil ' + nombre + '?')
    setShow(true)
  }

  async function eliminarPerfil(id_perfil, opcion) {
    setDesactivarBotonModal(true)
    if (opcion == 1) {
      const respuesta = await postCrudPerfil(id_perfil, '', '', '2', session.id, session.api_token)
      if (respuesta === 'OK') {
        await getPerfiles(null, null, session.api_token).then((items) => {
          setList(items.perfiles)
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

  const columns = useMemo(() => [
    {
      name: 'Descripcion',
      selector: (row) => row.descripcion,
      center: true,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      wrap: true,
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
        if (ExistePermiso('Modulo Perfiles') == 0) {
          deshabilitar = true
        }
        let estado = 'Inactivo'
        if (row.activo == 1) {
          estado = 'Activo'
        }
        return (
          <div>
            <CButton
              color="info"
              size="sm"
              title="Consultar Perfil Rol"
              disabled={deshabilitar}
              onClick={() =>
                history.push({
                  pathname: '/perfiles/consulta',
                  id_perfil: row.id_perfil,
                  descripcion: row.descripcion,
                  estado: estado,
                })
              }
            >
              <FaClipboardList />
            </CButton>{' '}
            <CButton
              color="success"
              size="sm"
              title="Asignar Rol"
              disabled={deshabilitar}
              onClick={() =>
                history.push({
                  pathname: '/perfiles/perfilrol',
                  id_perfil: row.id_perfil,
                  descripcion: row.descripcion,
                  estado: row.activo,
                })
              }
            >
              <FaUserCog />
            </CButton>{' '}
            <CButton
              color="primary"
              size="sm"
              title="Editar Perfil"
              disabled={deshabilitar}
              onClick={() =>
                history.push({
                  pathname: '/perfiles/editar',
                  id_perfil: row.id_perfil,
                  descripcion: row.descripcion,
                  estado: row.activo,
                })
              }
            >
              <FaUserEdit />
            </CButton>{' '}
            <CButton
              color="danger"
              size="sm"
              title="Eliminar Perfil"
              disabled={deshabilitar}
              onClick={() => mostrarModal(row.id_perfil, row.descripcion, 1)}
            >
              <FaTrash />
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
    if (ExistePermiso('Modulo Perfiles') == 0) {
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
              onClick={() => eliminarPerfil(idPerfil, opcion).then(() => Cancelar(1))}
            >
              Aceptar
            </CButton>
          </Modal.Footer>
        </Modal>
        <div className="float-right" style={{ marginBottom: '10px' }}>
          <CButton
            color="primary"
            size="sm"
            disabled={deshabilitar}
            onClick={() => history.push('/perfiles/nuevo')}
          >
            Crear Nuevo
          </CButton>
        </div>
        <DataTableExtensions {...tableData}>
          <DataTable
            columns={columns}
            noDataComponent="No hay perfiles que mostrar"
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

export default Perfiles
