import React, { useState, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { getUsuarioPrioridadMensajes } from '../../../../services/getUsuarioPrioridadMensajes'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { postUsuarioPrioridadMensajes } from '../../../../services/postUsuarioPrioridadMensajes'
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

const PrioridadChat = () => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])
  const [show, setShow] = useState(false)
  const [idPrioridad, setIdPrioridad] = useState(0)
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')
  const [resultsUsuarios, setListUsuarios] = useState([])
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(0)
  const [desactivarBotonModal, setDesactivarBotonModal] = useState(false)

  useEffect(() => {
    let mounted = true
    let objeto = 'Modulo PrioridadChat'
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getUsuarios(null, null, null, null, session.api_token).then((items) => {
      if (mounted) {
        setListUsuarios(items.users)
      }
    })
    getUsuarioPrioridadMensajes(null, session.api_token).then((items) => {
      if (mounted) {
        setList(items.prioridad)
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

  function mostrarModal(idPrioridad, opcion) {
    setIdPrioridad(idPrioridad)
    setMensaje('Está seguro de eliminar el registro?')
    setOpcion(opcion)
    setShow(true)
  }
  function SeleccionUsuario(event) {
    setUsuarioSeleccionado(event.target.value)
  }

  async function BuscarDatos() {
    await getUsuarioPrioridadMensajes(usuarioSeleccionado, session.api_token).then((items) => {
      setList(items.prioridad)
    })
  }

  async function eliminarPrioridad(idPrioridad, opcion) {
    setDesactivarBotonModal(true)
    if (opcion == 1) {
      const respuesta = await postUsuarioPrioridadMensajes(
        idPrioridad,
        '',
        '',
        '',
        '2',
        '',
        session.id,
        session.api_token,
      )
      if (respuesta === 'OK') {
        await getUsuarioPrioridadMensajes(usuarioSeleccionado, session.api_token).then((items) => {
          setList(items.prioridad)
        })
      } else if (opcion == 2) {
        setShow(false)
      }
    }
    setDesactivarBotonModal(false)
  }

  async function CambiarNivelPrioridad(idPrioridad, nivel) {
    const respuesta = await postUsuarioPrioridadMensajes(
      idPrioridad,
      '',
      '',
      nivel,
      '1',
      '',
      session.id,
      session.api_token,
    )
    if (respuesta === 'OK') {
      await getUsuarioPrioridadMensajes(usuarioSeleccionado, session.api_token).then((items) => {
        setList(items.prioridad)
      })
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

  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: 'TODOS',
  }

  const columns = useMemo(() => [
    {
      name: 'Usuario',
      selector: (row) => row.usuario_con,
      center: false,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      wrap: true,
    },
    {
      name: 'Nombre',
      selector: (row) => row.nombre_con + ' ' + row.apellido_con,
      center: false,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      wrap: true,
    },
    {
      name: 'Usuario prioridad',
      selector: (row) => row.usuario_pri,
      center: false,
      style: {
        fontSize: '11px',
      },
    },
    {
      name: 'Nombre prioridad',
      selector: (row) => row.nombre_pri + ' ' + row.apellido_pri,
      center: false,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      wrap: true,
    },
    {
      name: 'Nivel',
      selector: (row) => row.nivel,
      center: false,
      style: {
        fontSize: '11px',
      },
    },
    {
      name: 'Acciones',
      cell: function OrderItems(row) {
        let deshabilitar = false
        if (ExistePermiso('Modulo PrioridadChat') == 0) {
          deshabilitar = true
        }
        return (
          <div>
            <CButton
              color="primary"
              size="sm"
              title="Subir prioridad"
              disabled={deshabilitar}
              onClick={() => CambiarNivelPrioridad(row.id_usuarioprioridadmensajes, row.nivel - 1)}
            >
              <FaChevronUp />
            </CButton>{' '}
            <CButton
              color="primary"
              size="sm"
              title="Bajar prioridad"
              disabled={deshabilitar}
              onClick={() => CambiarNivelPrioridad(row.id_usuarioprioridadmensajes, row.nivel + 1)}
            >
              <FaChevronDown />
            </CButton>{' '}
            <CButton
              color="danger"
              size="sm"
              title="Eliminar prioridad"
              disabled={deshabilitar}
              onClick={() => mostrarModal(row.id_usuarioprioridadmensajes, 1)}
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
    if (ExistePermiso('Modulo PrioridadChat') == 0) {
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
              disabled={desactivarBotonModal}
              onClick={() => eliminarPrioridad(idPrioridad, opcion).then(() => Cancelar(1))}
            >
              Aceptar
            </CButton>
          </Modal.Footer>
        </Modal>
        <div style={{ display: 'flex', marginBottom: '10px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              width: '50%',
              gap: '10px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                width: '50%',
                gap: '10px',
              }}
            >
              <CFormSelect name="id_usuario" onChange={SeleccionUsuario}>
                <option value="0">Seleccione un usuario.</option>
                {resultsUsuarios.map((item, i) => {
                  if (item.eliminado == 0 && item.activo == 1) {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.nombre + ' ' + item.apellido + ' [' + item.nombre_usuario + ']'}
                      </option>
                    )
                  }
                })}
              </CFormSelect>
            </div>
            <CButton
              color="primary"
              size="sm"
              disabled={deshabilitar}
              onClick={() => BuscarDatos()}
            >
              Buscar
            </CButton>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '50%',
              gap: '10px',
            }}
          >
            <CButton
              color="primary"
              size="sm"
              disabled={deshabilitar}
              onClick={() => history.push('/prioridadchat/nueva')}
            >
              Crear Nueva
            </CButton>
          </div>
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

export default PrioridadChat
