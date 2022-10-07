import React, { useState, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { Modal, FormControl } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { getBancos } from '../../../../services/getBancos'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { postCrudBancos } from '../../../../services/postCrudBancos'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { useSession } from 'react-use-session'
import { FaPen, FaTrash } from 'react-icons/fa'
import '../../../../scss/estilos.scss'
import { CButton } from '@coreui/react'
import DataTable, { defaultThemes } from 'react-data-table-component'
import DataTableExtensions from 'react-data-table-component-extensions'
import 'react-data-table-component-extensions/dist/index.css'

const Bancos = () => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])
  const [show, setShow] = useState(false)
  const [idBanco, setIdBanco] = useState(0)
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')
  const [filterText, setFilterText] = useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
  const filteredItems = results.filter(
    (item) =>
      item.codigo_transferencia.toString().toLowerCase().includes(filterText.toLowerCase()) ||
      item.nombre.toLowerCase().includes(filterText.toLowerCase()) ||
      item.direccion.toLowerCase().includes(filterText.toLowerCase()) ||
      item.Nombre.toLowerCase().includes(filterText.toLowerCase()),
  )
  const [desactivarBotonModal, setDesactivarBotonModal] = useState(false)

  useEffect(() => {
    let mounted = true
    let objeto = 'Modulo Bancos'
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getBancos(null, null, session.api_token).then((items) => {
      if (mounted) {
        setList(items.bancos)
      }
    })
    getPerfilUsuario(idUsuario, '2', objeto, session.api_token).then((items) => {
      if (mounted) {
        setPermisos(items.detalle)
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
      name: 'No.',
      selector: (row) => row.codigo_transferencia,
      center: true,
      width: '65px',
      sortable: true,
      wrap: true,
    },
    {
      name: 'Nombre',
      selector: (row) => row.nombre,
      center: true,
      width: '320px',
      sortable: true,
      wrap: true,
    },
    {
      name: 'Dirección',
      selector: (row) => row.direccion,
      center: true,
      width: '300px',
      sortable: true,
      wrap: true,
    },
    {
      name: 'País',
      selector: (row) => row.Nombre,
      center: true,
      width: '100px',
      sortable: true,
      wrap: true,
    },
    {
      name: 'SAP',
      selector: (row) => row.codigo_SAP,
      center: true,
      width: '90px',
      sortable: true,
      wrap: true,
    },
    {
      name: 'Estado',
      center: true,
      width: '80px',
      cell: function OrderItems(row) {
        if (row.activo == 1) {
          return <div>Activo</div>
        } else if (row.activo == 0) {
          return <div>Inactivo</div>
        }
      },
      sortable: true,
      wrap: true,
    },
    {
      name: 'Acciones',
      width: '10%',
      sortable: true,
      wrap: true,
      cell: function OrderItems(row) {
        let deshabilitar = false
        if (ExistePermiso('Modulo Bancos') == 0) {
          deshabilitar = true
        }
        return (
          <div>
            <CButton
              color="primary"
              size="sm"
              title="Editar Banco"
              disabled={deshabilitar}
              onClick={() =>
                history.push({
                  pathname: '/bancos/editar',
                  id_banco: row.id_banco,
                  nombre: row.nombre,
                  direccion: row.direccion,
                  codigoTransferencia: row.codigo_transferencia,
                  codigoSAP: row.codigo_SAP,
                  pais: row.id_pais,
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
              onClick={() => mostrarModal(row.id_banco, 1, row.nombre)}
            >
              <FaTrash />
            </CButton>
          </div>
        )
      },
      center: true,
    },
  ])

  const tableData = {
    columns,
    data: results,
    filterPlaceholder: 'Filtrar datos',
    export: false,
    print: false,
  }

  function ExistePermiso(objeto) {
    let result = 0
    for (let item of permisos) {
      if (objeto === item.objeto) {
        result = 1
      }
    }
    return result
  }

  function mostrarModal(id_banco, opcion, nombre) {
    setIdBanco(id_banco)
    setOpcion(opcion)
    setMensaje('Está seguro de eliminar el banco ' + nombre + '?')
    setShow(true)
  }

  async function eliminarBanco(id_banco, opcion) {
    setDesactivarBotonModal(true)
    if (opcion == 1) {
      const respuesta = await postCrudBancos(
        id_banco,
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
        await getBancos(null, null, session.api_token).then((items) => {
          setList(items.bancos)
        })
      }
    } else if (opcion == 2) {
      setShow(false)
    }
    setDesactivarBotonModal(false)
  }

  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle)
      setFilterText('')
    }
  }

  const crearNuevo = () => {
    history.push('/bancos/nuevo')
  }

  if (session) {
    let deshabilitar = false
    if (ExistePermiso('Modulo Bancos') == 0) {
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
              onClick={() => eliminarBanco(idBanco, opcion).then(() => Cancelar(1))}
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
            onClick={() => history.push('/bancos/nuevo')}
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

export default Bancos
