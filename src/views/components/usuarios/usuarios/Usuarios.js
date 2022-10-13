import React, { useState, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import { postEditarUsuario } from '../../../../services/postEditarUsuario'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { getUsuarios } from '../../../../services/getUsuarios'
import { useSession } from 'react-use-session'
import { FaUserEdit, FaTrash, FaUserCog, FaUserCircle, FaUsersCog } from 'react-icons/fa'
import '../../../../scss/estilos.scss'
import { CButton } from '@coreui/react'
import DataTable, { defaultThemes } from 'react-data-table-component'
import DataTableExtensions from 'react-data-table-component-extensions'
import 'react-data-table-component-extensions/dist/index.css'

const Usuarios = () => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])
  const [show, setShow] = useState(false)
  const [idUsuario, setIdUsuario] = useState(0)
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')
  const [desactivarBotonModal, setDesactivarBotonModal] = useState(false)

  useEffect(() => {
    let mounted = true
    let objeto = 'Modulo Usuarios'
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getUsuarios(null, null, null, null, session.api_token).then((items) => {
      if (mounted) {
        setList(items.users)
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
      if (objeto == item.objeto) {
        result = true
      }
    }
    return result
  }

  function mostrarModal(id, nombre, opcion) {
    setIdUsuario(id)
    setOpcion(opcion)
    setShow(true)
    setMensaje('Está seguro de eliminar al usuario ' + nombre + '?')
  }

  async function eliminarUsuario(id, opcion) {
    setDesactivarBotonModal(true)
    if (opcion == 1) {
      const respuesta = await postEditarUsuario(
        id,
        '',
        '',
        '',
        '',
        '',
        '',
        '2',
        session.id,
        session.api_token,
      )
      if (respuesta === 'OK') {
        await getUsuarios(null, null, null, null, session.api_token).then((items) => {
          setList(items.users)
        })
      }
    } else if (opcion == 2) {
      setShow(false)
    }
    setDesactivarBotonModal(false)
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
      name: 'Nombre',
      selector: (row) => row.nombre + ' ' + row.apellido,
      center: false,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      wrap: true,
    },
    {
      name: 'Correo',
      selector: (row) => row.email,
      center: false,
      style: {
        fontSize: '11px',
      },
      sortable: true,
    },
    {
      name: 'Usuario',
      selector: (row) => row.nombre_usuario,
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
              title="Consultar Usuario Perfil"
              disabled={deshabilitar}
              onClick={() =>
                history.push({
                  pathname: '/usuarios/consulta',
                  id_usuario: row.id,
                  email: row.email,
                  nombre: row.nombre + ' ' + row.apellido,
                  estado: row.activo,
                })
              }
            >
              <FaUserCircle />
            </CButton>{' '}
            <CButton
              color="success"
              size="sm"
              title="Asignar Perfiles"
              disabled={deshabilitar}
              onClick={() =>
                history.push({
                  pathname: '/usuarios/perfilusuario',
                  id: row.id,
                  nombre: row.nombre + ' ' + row.apellido,
                  email: row.email,
                  estado: row.activo,
                })
              }
            >
              <FaUserCog />
            </CButton>{' '}
            <CButton
              color="warning"
              size="sm"
              title="Asignar Grupo Autorización"
              disabled={deshabilitar}
              onClick={() =>
                history.push({
                  pathname: '/usuarios/usuariogrupo',
                  id_usuario: row.id,
                  nombre: row.nombre + ' ' + row.apellido,
                  email: row.email,
                  estado: row.activo,
                  inhabilitar: true,
                })
              }
            >
              <FaUsersCog />
            </CButton>{' '}
            <CButton
              color="primary"
              size="sm"
              title="Editar Usuario"
              disabled={deshabilitar}
              onClick={() =>
                history.push({
                  pathname: '/usuarios/editar',
                  id: row.id,
                  nombre: row.nombre,
                  apellido: row.apellido,
                  usuario: row.nombre_usuario,
                  email: row.email,
                  password: row.password,
                  estado: row.activo,
                  cambia_password: row.cambia_password,
                })
              }
            >
              <FaUserEdit />
            </CButton>{' '}
            <CButton
              color="danger"
              size="sm"
              title="Eliminar Usuario"
              disabled={deshabilitar}
              onClick={() => mostrarModal(row.id, row.nombre + ' ' + row.apellido, 1)}
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
    if (!ExistePermiso('Modulo Usuarios')) {
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
              color="primary"
              disabled={desactivarBotonModal}
              onClick={() => eliminarUsuario(idUsuario, opcion).then(() => Cancelar(1))}
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
            onClick={() => history.push('/usuarios/registro')}
          >
            Crear Nuevo
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

export default Usuarios
