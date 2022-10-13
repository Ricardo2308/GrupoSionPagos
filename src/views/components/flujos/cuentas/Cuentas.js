import React, { useState, useEffect, useMemo } from 'react'
import { Modal } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { getCuentas } from '../../../../services/getCuentas'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { postCrudCuentas } from '../../../../services/postCrudCuentas'
import { useIdleTimer } from 'react-idle-timer'
import { useSession } from 'react-use-session'
import { FaPen, FaTrash } from 'react-icons/fa'
import '../../../../scss/estilos.scss'
import { CButton } from '@coreui/react'
import DataTable, { defaultThemes } from 'react-data-table-component'
import DataTableExtensions from 'react-data-table-component-extensions'
import 'react-data-table-component-extensions/dist/index.css'

const Cuentas = () => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])
  const [show, setShow] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [idCuenta, setIdCuenta] = useState(0)
  const [opcion, setOpcion] = useState(0)
  const [desactivarBotonModal, setDesactivarBotonModal] = useState(false)

  useEffect(() => {
    let mounted = true
    let objeto = 'Modulo Cuentas'
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getCuentas(null, null, session.api_token).then((items) => {
      if (mounted) {
        setList(items.cuentas)
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

  function mostrarModal(id_cuenta, opcion, nombre) {
    setIdCuenta(id_cuenta)
    setOpcion(opcion)
    setMensaje('Está seguro de eliminar la cuenta número ' + nombre + '?')
    setShow(true)
  }

  async function eliminarCuenta(id_cuenta, opcion) {
    setDesactivarBotonModal(true)
    if (opcion == 1) {
      const respuesta = await postCrudCuentas(
        id_cuenta,
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
        await getCuentas(null, null, session.api_token).then((items) => {
          setList(items.cuentas)
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

  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: 'TODOS',
  }

  const columns = useMemo(() => [
    {
      name: 'Número Cuenta',
      selector: (row) => row.numero_cuenta,
      center: false,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      wrap: true,
    },
    {
      name: 'Nombre',
      selector: (row) => row.nombre,
      center: false,
      style: {
        fontSize: '11px',
      },
      sortable: true,
    },
    {
      name: 'Empresa',
      selector: (row) => row.empresa,
      center: false,
      sortable: true,
      style: {
        fontSize: '11px',
      },
    },
    {
      name: 'Banco',
      selector: (row) => row.banco,
      center: false,
      sortable: true,
      style: {
        fontSize: '11px',
      },
      wrap: true,
    },
    {
      name: 'Moneda',
      selector: (row) => row.moneda,
      center: false,
      sortable: true,
      style: {
        fontSize: '11px',
      },
      wrap: true,
    },
    {
      name: 'Código ACH',
      selector: (row) => row.codigo_ach,
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
        if (ExistePermiso('Modulo Cuentas') == 0) {
          deshabilitar = true
        }
        return (
          <div>
            <CButton
              color="primary"
              size="sm"
              title="Editar Cuenta"
              disabled={deshabilitar}
              onClick={() =>
                history.push({
                  pathname: '/cuentas/editar',
                  id_cuenta: row.id_cuenta,
                  numero_cuenta: row.numero_cuenta,
                  nombre: row.nombre,
                  id_empresa: row.id_empresa,
                  id_banco: row.id_banco,
                  id_moneda: row.id_moneda,
                  codigo_ach: row.codigo_ach,
                })
              }
            >
              <FaPen />
            </CButton>{' '}
            <CButton
              color="danger"
              size="sm"
              title="Eliminar Cuenta"
              disabled={deshabilitar}
              onClick={() => mostrarModal(row.id_cuenta, 1, row.numero_cuenta)}
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
    if (ExistePermiso('Modulo Cuentas') == 0) {
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
              onClick={() => eliminarCuenta(idCuenta, opcion).then(() => Cancelar(1))}
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
            onClick={() => history.push('/cuentas/nueva')}
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

export default Cuentas
