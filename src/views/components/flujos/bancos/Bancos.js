import React, { useState, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { Modal, FormControl } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import DataTable, { createTheme } from 'react-data-table-component'
import { getBancos } from '../../../../services/getBancos'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { postCrudBancos } from '../../../../services/postCrudBancos'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { useSession } from 'react-use-session'
import { FaPen, FaTrash } from 'react-icons/fa'
import '../../../../scss/estilos.scss'
import { CButton } from '@coreui/react'

const FilterComponent = (prop) => (
  <div className="div-search">
    <CButton
      color="primary"
      size="sm"
      className="btn-compensacion"
      disabled={prop.deshabilitar}
      onClick={prop.crearNuevo}
    >
      Crear Nuevo
    </CButton>
    <FormControl
      id="search"
      type="text"
      placeholder="Buscar Banco"
      aria-label="Search Input"
      value={prop.filterText}
      onChange={prop.onFilter}
    />
    <CButton
      color="primary"
      className="clear-search"
      onClick={prop.onClear}
      title="Limpiar Campo Búsqueda"
    >
      X
    </CButton>
  </div>
)

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
      item.codigo_transferencia.toLowerCase().includes(filterText.toLowerCase()) ||
      item.nombre.toLowerCase().includes(filterText.toLowerCase()) ||
      item.direccion.toLowerCase().includes(filterText.toLowerCase()) ||
      item.Nombre.toLowerCase().includes(filterText.toLowerCase()),
  )

  useEffect(() => {
    let mounted = true
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getBancos(null, null).then((items) => {
      if (mounted) {
        setList(items.bancos)
      }
    })
    getPerfilUsuario(idUsuario, '2').then((items) => {
      if (mounted) {
        setPermisos(items.detalle)
      }
    })
    return () => (mounted = false)
  }, [])

  async function Cancelar(opcion) {
    if (opcion == 1) {
      setShow(false)
      detener()
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
      detener()
    }
  }

  function iniciar(minutos) {
    let segundos = 60 * minutos
    const intervalo = setInterval(() => {
      segundos--
      if (segundos == 0) {
        Cancelar(2)
      }
    }, 1000)
    setTime(intervalo)
  }

  function detener() {
    clearInterval(time)
  }

  const handleOnIdle = (event) => {
    setShow(true)
    setOpcion(2)
    setMensaje(
      'Ya estuvo mucho tiempo sin realizar ninguna acción. Se cerrará sesión en unos minutos.' +
        ' Si desea continuar presione Aceptar',
    )
    iniciar(2)
    console.log('last active', getLastActiveTime())
  }

  const handleOnActive = (event) => {
    console.log('time remaining', getRemainingTime())
  }

  const handleOnAction = (event) => {}

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * parseInt(session == null ? 1 : session.limiteconexion),
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500,
  })

  const customStyles = {
    headCells: {
      style: {
        paddingLeft: '8px', // override the cell padding for head cells
        paddingRight: '8px',
        fontSize: '14px',
      },
    },
  }

  createTheme('solarized', {
    text: {
      primary: 'black',
    },
    background: {
      default: 'white',
    },
    context: {
      background: '#cb4b16',
      text: '#FFFFFF',
    },
    divider: {
      default: '#073642',
    },
    action: {
      button: 'rgba(0,0,0,.54)',
      hover: 'rgba(0,0,0,.08)',
      disabled: 'rgba(0,0,0,.12)',
    },
  })

  const columns = useMemo(() => [
    {
      name: 'No.',
      selector: 'codigo_transferencia',
      center: true,
      width: '65px',
    },
    {
      name: 'Nombre',
      selector: 'nombre',
      center: true,
      width: '320px',
    },
    {
      name: 'Dirección',
      selector: 'direccion',
      center: true,
      width: '300px',
    },
    {
      name: 'País',
      selector: 'Nombre',
      center: true,
      width: '100px',
    },
    {
      name: 'SAP',
      selector: 'codigo_SAP',
      center: true,
      width: '90px',
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
    },
    {
      name: 'Acciones',
      width: '10%',
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
    if (opcion == 1) {
      const respuesta = await postCrudBancos(id_banco, '', '', '', '', '', '', '2')
      if (respuesta === 'OK') {
        await getBancos(null, null).then((items) => {
          setList(items.bancos)
        })
      }
    } else if (opcion == 2) {
      setShow(false)
      detener()
    }
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
              color="primary"
              onClick={() => eliminarBanco(idBanco, opcion).then(() => Cancelar(1))}
            >
              Aceptar
            </CButton>
          </Modal.Footer>
        </Modal>
        <div className="float-right" style={{ marginBottom: '10px' }}>
          <FilterComponent
            onFilter={(e) => setFilterText(e.target.value)}
            onClear={handleClear}
            crearNuevo={crearNuevo}
            filterText={filterText}
            deshabilitar={deshabilitar}
          />
        </div>
        <DataTable
          columns={columns}
          noDataComponent="No hay pagos que mostrar"
          data={filteredItems}
          customStyles={customStyles}
          theme="solarized"
          pagination
          paginationPerPage={6}
          paginationResetDefaultPage={resetPaginationToggle}
          responsive={true}
          persistTableHead
        />
      </>
    )
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default Bancos
