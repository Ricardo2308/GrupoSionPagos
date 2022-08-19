import React, { useState, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import { getCuentaGrupoAutorizacion } from '../../../../services/getCuentaGrupoAutorizacion'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { postCrudCuentaGrupoAutorizacion } from '../../../../services/postCrudCuentaGrupoAutorizacion'
import { useSession } from 'react-use-session'
import { FaUserEdit, FaTrash, FaUserCog, FaClipboardList } from 'react-icons/fa'
import '../../../../scss/estilos.scss'
import { CButton } from '@coreui/react'
import DataTable, { defaultThemes } from 'react-data-table-component'
import DataTableExtensions from 'react-data-table-component-extensions'
import 'react-data-table-component-extensions/dist/index.css'

const CuentaGrupoAutorizacion = () => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])
  const [show, setShow] = useState(false)
  const [idCuentaGrupo, setidCuentaGrupo] = useState(0)
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    let mounted = true
    let objeto = 'Modulo CuentaGrupoAutorizacion'
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getCuentaGrupoAutorizacion(null, session.api_token).then((items) => {
      if (mounted) {
        setList(items.cuenta_grupo_autorizacion)
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

  function mostrarModal(id_cuentagrupo, opcion) {
    setidCuentaGrupo(id_cuentagrupo)
    setOpcion(opcion)
    setShow(true)
    setMensaje('Está seguro de eliminar la(s) cuenta(s) listado?')
  }

  async function eliminarRol(id, opcion) {
    if (opcion == 1) {
      const respuesta = await postCrudCuentaGrupoAutorizacion(
        id,
        '',
        '',
        '2',
        session.id,
        session.api_token,
      )
      if (respuesta === 'OK') {
        await getCuentaGrupoAutorizacion(null, session.api_token).then((items) => {
          setList(items.cuenta_grupo_autorizacion)
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
      name: 'Cuenta(s)',
      selector: (row) => row.CodigoCuenta,
      center: true,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      wrap: true,
    },
    {
      name: 'Grupo autorización',
      selector: (row) => row.identificador,
      center: true,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      wrap: true,
    },
    {
      name: 'Acciones',
      cell: function OrderItems(row) {
        let estado = 'Inactivo'
        if (row.activo == 1) {
          estado = 'Activo'
        }
        let deshabilitar = false
        if (ExistePermiso('Modulo CuentaGrupoAutorizacion') == 0) {
          deshabilitar = true
        }
        return (
          <div>
            <CButton
              color="danger"
              size="sm"
              title="Eliminar cuenta"
              disabled={deshabilitar}
              onClick={() => mostrarModal(row.id_cuentagrupo, 1)}
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
    if (ExistePermiso('Modulo CuentaGrupoAutorizacion') == 0) {
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
              onClick={() => eliminarRol(idCuentaGrupo, opcion).then(() => Cancelar(1))}
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
            onClick={() => history.push('/cuentagrupoautorizacion/nuevo')}
          >
            Agregar Nueva
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
          />
        </DataTableExtensions>
      </>
    )
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default CuentaGrupoAutorizacion