import React, { useState, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { getOcultarColumnaUsuario } from '../../../../services/getOcultarColumnaUsuario'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { postOcultarColumnaUsuario } from '../../../../services/postOcultarColumnaUsuario'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { useSession } from 'react-use-session'
import { FaPen, FaTrash, FaChevronUp, FaChevronDown } from 'react-icons/fa'
import '../../../../scss/estilos.scss'
import {
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormSelect,
} from '@coreui/react'
import DataTable, { defaultThemes } from 'react-data-table-component'
import DataTableExtensions from 'react-data-table-component-extensions'
import 'react-data-table-component-extensions/dist/index.css'
import { getUsuarios } from '../../../../services/getUsuarios'

const OcultarColumnas = () => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])
  const [show, setShow] = useState(false)
  const [idOcultar, setidOcultar] = useState(0)
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')
  const [resultsUsuarios, setListUsuarios] = useState([])
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(0)

  useEffect(() => {
    let mounted = true
    let objeto = 'Modulo OcultarColumnas'
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getOcultarColumnaUsuario(null, session.api_token).then((items) => {
      if (mounted) {
        setList(items.ocultar)
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

  function mostrarModal(idOcultar, opcion) {
    setidOcultar(idOcultar)
    setMensaje('Está seguro de eliminar el registro?')
    setOpcion(opcion)
    setShow(true)
  }

  async function eliminarOcultar(idOcultar, opcion) {
    if (opcion == 1) {
      const respuesta = await postOcultarColumnaUsuario(
        idOcultar,
        '',
        '',
        '2',
        '',
        session.id,
        session.api_token,
      )
      if (respuesta === 'OK') {
        await getOcultarColumnaUsuario(null, session.api_token).then((items) => {
          setList(items.ocultar)
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
      name: 'Usuario',
      selector: (row) => row.usuario,
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
      name: 'Columna',
      selector: (row) => row.NombreColumna,
      center: true,
      style: {
        fontSize: '11px',
      },
    },
    {
      name: 'Acciones',
      cell: function OrderItems(row) {
        let deshabilitar = false
        if (ExistePermiso('Modulo OcultarColumnas') == 0) {
          deshabilitar = true
        }
        return (
          <div>
            <CButton
              color="danger"
              size="sm"
              title="Eliminar registro"
              disabled={deshabilitar}
              onClick={() => mostrarModal(row.id_ocultarcolumnausuario, 1)}
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
    if (ExistePermiso('Modulo OcultarColumnas') == 0) {
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
              onClick={() => eliminarOcultar(idOcultar, opcion).then(() => Cancelar(1))}
            >
              Aceptar
            </CButton>
          </Modal.Footer>
        </Modal>
        <div style={{ display: 'flex', marginBottom: '10px', justifyContent: 'flex-end' }}>
          <CButton
            color="primary"
            size="sm"
            disabled={deshabilitar}
            onClick={() => history.push('/ocultarcolumnas/nueva')}
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

export default OcultarColumnas
