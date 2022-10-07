import React, { useState, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { getMonedas } from '../../../../services/getMonedas'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { postCrudMonedas } from '../../../../services/postCrudMonedas'
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

const Monedas = () => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])
  const [show, setShow] = useState(false)
  const [idMoneda, setIdMoneda] = useState(0)
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')
  const [desactivarBotonModal, setDesactivarBotonModal] = useState(false)

  useEffect(() => {
    let mounted = true
    let objeto = 'Modulo Monedas'
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getMonedas(null, null, session.api_token).then((items) => {
      if (mounted) {
        setList(items.monedas)
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

  function mostrarModal(id_moneda, nombre, opcion) {
    setIdMoneda(id_moneda)
    setOpcion(opcion)
    setMensaje('Está seguro de eliminar la moneda ' + nombre + '?')
    setShow(true)
  }

  async function eliminarMoneda(id_moneda, opcion) {
    setDesactivarBotonModal(true)
    if (opcion == 1) {
      const respuesta = await postCrudMonedas(
        id_moneda,
        '',
        '',
        '',
        '2',
        session.id,
        session.api_token,
      )
      if (respuesta === 'OK') {
        await getMonedas(null, null, session.api_token).then((items) => {
          setList(items.monedas)
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
      name: 'Nombre',
      selector: (row) => row.nombre,
      center: true,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      wrap: true,
    },
    {
      name: 'Símbolo',
      selector: (row) => row.simbolo,
      center: true,
      style: {
        fontSize: '11px',
      },
      sortable: true,
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
        if (ExistePermiso('Modulo Monedas') == 0) {
          deshabilitar = true
        }
        return (
          <div>
            <CButton
              color="primary"
              size="sm"
              title="Editar Moneda"
              disabled={deshabilitar}
              onClick={() =>
                history.push({
                  pathname: '/monedas/editar',
                  id_moneda: row.id_moneda,
                  nombre: row.nombre,
                  simbolo: row.simbolo,
                  estado: row.activo,
                })
              }
            >
              <FaPen />
            </CButton>{' '}
            <CButton
              color="danger"
              size="sm"
              title="Eliminar Banco"
              disabled={deshabilitar}
              onClick={() => mostrarModal(row.id_moneda, row.nombre, 1)}
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
    if (ExistePermiso('Modulo Monedas') == 0) {
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
              onClick={() => eliminarMoneda(idMoneda, opcion).then(() => Cancelar(1))}
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
            onClick={() => history.push('/monedas/nueva')}
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
          />
        </DataTableExtensions>
      </>
    )
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default Monedas
