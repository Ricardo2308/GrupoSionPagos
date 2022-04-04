import React, { useState, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { getGruposAutorizacion } from '../../../../services/getGruposAutorizacion'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { postGruposAutorizacion } from '../../../../services/postGruposAutorizacion'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { useSession } from 'react-use-session'
import { FaPen, FaTrash } from 'react-icons/fa'
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

const GruposAutorizacion = () => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])
  const [show, setShow] = useState(false)
  const [idGrupo, setIdGrupo] = useState(0)
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    let mounted = true
    let objeto = 'Modulo Grupos Autorizacion'
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getGruposAutorizacion(null, null).then((items) => {
      if (mounted) {
        setList(items.grupos)
      }
    })
    getPerfilUsuario(idUsuario, '2', objeto).then((items) => {
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
      const respuesta = await postSesionUsuario(idUsuario, null, null, '2')
      if (respuesta === 'OK') {
        clear()
        history.push('/')
      }
    }
  }

  function mostrarModal(id_grupo, nombre, opcion) {
    setIdGrupo(id_grupo)
    setOpcion(opcion)
    setMensaje('Está seguro de eliminar el grupo ' + nombre + '?')
    setShow(true)
  }

  async function eliminarGrupo(id_grupo, opcion) {
    if (opcion == 1) {
      const respuesta = await postGruposAutorizacion(id_grupo, '', '', '', '', '2', session.id)
      if (respuesta === 'OK') {
        await getGruposAutorizacion(null, null).then((items) => {
          setList(items.grupos)
        })
      }
    } else if (opcion == 2) {
      setShow(false)
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
      name: 'Grupo Autorización',
      selector: (row) => row.identificador,
      center: true,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      wrap: true,
      width: '200px',
    },
    {
      name: 'Niveles',
      selector: (row) => row.numero_niveles,
      center: true,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      width: '100px',
    },
    {
      name: 'Descripción',
      selector: (row) => row.descripcion,
      center: true,
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
      center: true,
      style: {
        fontSize: '11px',
      },
      wrap: true,
      width: '100px',
    },
    {
      name: 'Acciones',
      cell: function OrderItems(row) {
        let deshabilitar = false
        if (ExistePermiso('Modulo Grupos Autorizacion') == 0) {
          deshabilitar = true
        }
        return (
          <div>
            <CButton
              color="primary"
              size="sm"
              title="Editar Grupo Autorización"
              disabled={deshabilitar}
              onClick={() =>
                history.push({
                  pathname: '/grupos/editar',
                  id_grupo: row.id_grupo,
                  numero_niveles: row.numero_niveles,
                  identificador: row.identificador,
                  descripcion: row.descripcion,
                  estado: row.activo,
                })
              }
            >
              <FaPen />
            </CButton>{' '}
            <CButton
              color="danger"
              size="sm"
              title="Eliminar Grupo Autorización"
              disabled={deshabilitar}
              onClick={() => mostrarModal(row.id_grupo, row.identificador, 1)}
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
    if (ExistePermiso('Modulo Grupos Autorizacion') == 0) {
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
              onClick={() => eliminarGrupo(idGrupo, opcion).then(() => Cancelar(1))}
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
            onClick={() => history.push('/grupos/nuevo')}
          >
            Crear Nuevo
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

export default GruposAutorizacion
