import React, { useState, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { getSeccionAplicacion } from '../../../services/getSeccionAplicacion'
import { getPerfilUsuario } from '../../../services/getPerfilUsuario'
import { postSeccionAplicacion } from '../../../services/postSeccionAplicacion'
import { postSesionUsuario } from '../../../services/postSesionUsuario'
import { useSession } from 'react-use-session'
import { FaPen, FaTrash } from 'react-icons/fa'
import '../../../scss/estilos.scss'
import { CButton } from '@coreui/react'
import DataTable, { defaultThemes } from 'react-data-table-component'
import DataTableExtensions from 'react-data-table-component-extensions'
import 'react-data-table-component-extensions/dist/index.css'

const SeccionAplicacion = () => {
  const history = useHistory()
  const { session, clear } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [show, setShow] = useState(false)
  const [idSeccionAplicacion, setIdSeccionAplicacion] = useState(0)
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')
  const [desactivarBotonModal, setDesactivarBotonModal] = useState(false)

  useEffect(() => {
    let mounted = true
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getSeccionAplicacion(session.api_token).then((items) => {
      if (mounted) {
        setList(items.seccion)
      }
    })
    return () => (mounted = false)
  }, [])

  function mostrarModal(idSeccionAplicacion, opcion, nombre) {
    setIdSeccionAplicacion(idSeccionAplicacion)
    setMensaje('Está seguro de eliminar la sección ' + nombre + '?')
    setOpcion(opcion)
    setShow(true)
  }

  async function eliminarSeccionAplicacion(idSeccionAplicacion, opcion) {
    setDesactivarBotonModal(true)
    if (opcion == 1) {
      const respuesta = await postSeccionAplicacion(
        idSeccionAplicacion,
        '',
        '',
        '',
        '2',
        '',
        session.id,
        session.api_token,
      )
      if (respuesta === 'OK') {
        await getSeccionAplicacion(session.api_token).then((items) => {
          setList(items.seccion)
        })
      } else if (opcion == 2) {
        setShow(false)
      }
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
      name: 'Dirección',
      selector: (row) => row.direccion,
      center: true,
      style: {
        fontSize: '11px',
      },
    },
    {
      name: 'Dirección movil',
      selector: (row) => row.direccion_movil,
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
        return (
          <div>
            <CButton
              color="primary"
              size="sm"
              title="Editar Política"
              onClick={() =>
                history.push({
                  pathname: '/seccionaplicacion/editar',
                  id_seccionaplicacion: row.id_seccionaplicacion,
                  nombre: row.nombre,
                  direccion: row.direccion,
                  direccion_movil: row.direccion_movil,
                  estado: row.activo,
                })
              }
            >
              <FaPen />
            </CButton>{' '}
            <CButton
              color="danger"
              size="sm"
              title="Eliminar Sección"
              onClick={() => mostrarModal(row.id_seccionaplicacion, 1, row.nombre)}
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
              disabled={desactivarBotonModal}
              onClick={() =>
                eliminarSeccionAplicacion(idSeccionAplicacion, opcion).then(() => Cancelar(1))
              }
            >
              Aceptar
            </CButton>
          </Modal.Footer>
        </Modal>
        <div className="float-right" style={{ marginBottom: '10px' }}>
          <CButton
            color="primary"
            size="sm"
            onClick={() => history.push('/seccionaplicacion/nueva')}
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

export default SeccionAplicacion
