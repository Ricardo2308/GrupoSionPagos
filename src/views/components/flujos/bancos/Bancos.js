import React, { useState, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { Modal, FormControl } from 'react-bootstrap'
import DataTable, { createTheme } from 'react-data-table-component'
import { getBancos } from '../../../../services/getBancos'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { postCrudBancos } from '../../../../services/postCrudBancos'
import { useSession } from 'react-use-session'
import { FaUserEdit, FaTrash } from 'react-icons/fa'
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
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])
  const [show, setShow] = useState(false)
  const [idBanco, setIdBanco] = useState(0)
  const [filterText, setFilterText] = useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
  const filteredItems = results.filter(
    (item) =>
      item.codigo_transferencia.toLowerCase().includes(filterText.toLowerCase()) ||
      item.nombre.toLowerCase().includes(filterText.toLowerCase()) ||
      item.direccion.toLowerCase().includes(filterText.toLowerCase()) ||
      item.Nombre.toLowerCase().includes(filterText.toLowerCase()),
  )

  const handleClose = () => setShow(false)

  useEffect(() => {
    let mounted = true
    getBancos(null, null).then((items) => {
      if (mounted) {
        setList(items.bancos)
      }
    })
    getPerfilUsuario(session.id, '2').then((items) => {
      if (mounted) {
        setPermisos(items.detalle)
      }
    })
    return () => (mounted = false)
  }, [])

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
      width: '8%',
    },
    {
      name: 'Nombre',
      selector: 'nombre',
      center: true,
      width: '25%',
    },
    {
      name: 'Dirección',
      selector: 'direccion',
      center: true,
      width: '25%',
    },
    {
      name: 'País',
      selector: 'Nombre',
      center: true,
    },
    {
      name: 'Código SAP',
      selector: 'codigo_SAP',
      center: true,
      width: '10%',
    },
    {
      name: 'Estado',
      center: true,
      width: '10%',
      cell: function OrderItems(row) {
        if (row.activo === '1') {
          return <div>Activo</div>
        } else if (row.activo === '0') {
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
              <FaUserEdit />
            </CButton>{' '}
            <CButton
              color="danger"
              size="sm"
              title="Eliminar Banco"
              disabled={deshabilitar}
              onClick={() => mostrarModal(row.id_banco)}
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

  function mostrarModal(id_banco) {
    setIdBanco(id_banco)
    setShow(true)
  }

  async function eliminarBanco(id_banco) {
    const respuesta = await postCrudBancos(id_banco, '', '', '', '2')
    if (respuesta === 'OK') {
      await getBancos(null, null).then((items) => {
        setList(items.bancos)
      })
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
        <Modal variant="primary" show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación</Modal.Title>
          </Modal.Header>
          <Modal.Body>Está seguro de eliminar este banco?</Modal.Body>
          <Modal.Footer>
            <CButton color="secondary" onClick={handleClose}>
              Cancelar
            </CButton>
            <CButton color="primary" onClick={() => eliminarBanco(idBanco).then(handleClose)}>
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
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default Bancos
