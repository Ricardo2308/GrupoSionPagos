import React, { useState, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { getPoliticas } from '../../../services/getPoliticas'
import { getPerfilUsuario } from '../../../services/getPerfilUsuario'
import { postCrudPoliticas } from '../../../services/postCrudPoliticas'
import { postSesionUsuario } from '../../../services/postSesionUsuario'
import { useSession } from 'react-use-session'
import { FaPen, FaTrash } from 'react-icons/fa'
import '../../../scss/estilos.scss'
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

const Politicas = () => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])
  const [show, setShow] = useState(false)
  const [idPolitica, setIdPolitica] = useState(0)
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    let mounted = true
    let objeto = 'Modulo Politicas'
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getPoliticas(null, null).then((items) => {
      if (mounted) {
        setList(items.politicas)
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

  function mostrarModal(idPolitica, opcion, nombre) {
    setIdPolitica(idPolitica)
    setMensaje('Está seguro de eliminar la política ' + nombre + '?')
    setOpcion(opcion)
    setShow(true)
  }

  async function eliminarPolitica(idPolitica, opcion) {
    if (opcion == 1) {
      const respuesta = await postCrudPoliticas(idPolitica, '', '', '', '', '2', session.id)
      if (respuesta === 'OK') {
        await getPoliticas(null, null).then((items) => {
          setList(items.politicas)
        })
      } else if (opcion == 2) {
        setShow(false)
      }
    }
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
      name: 'Descripción',
      selector: (row) => row.descripcion,
      center: true,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      wrap: true,
    },
    {
      name: 'Identificador',
      selector: (row) => row.identificador,
      center: true,
      style: {
        fontSize: '11px',
      },
    },
    {
      name: 'Valor',
      selector: (row) => row.valor,
      center: true,
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
        if (ExistePermiso('Modulo Politicas') == 0) {
          deshabilitar = true
        }
        return (
          <div>
            <CButton
              color="primary"
              size="sm"
              title="Editar Política"
              disabled={deshabilitar}
              onClick={() =>
                history.push({
                  pathname: '/politicas/editar',
                  id_politica: row.id_politica,
                  descripcion: row.descripcion,
                  identificador: row.identificador,
                  valor: row.valor,
                  estado: row.activo,
                })
              }
            >
              <FaPen />
            </CButton>{' '}
            <CButton
              color="danger"
              size="sm"
              title="Eliminar Política"
              disabled={deshabilitar}
              onClick={() => mostrarModal(row.id_politica, 1, row.identificador)}
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
    if (ExistePermiso('Modulo Politicas') == 0) {
      deshabilitar = true
    }
    return (
      <>
        <Modal variant="primary" show={show} onHide={() => Cancelar(opcion)} centered>
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
              onClick={() => eliminarPolitica(idPolitica, opcion).then(() => Cancelar(1))}
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
            onClick={() => history.push('/politicas/nueva')}
          >
            Crear Nueva
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

export default Politicas
