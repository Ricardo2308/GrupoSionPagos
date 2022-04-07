import React, { useState, useEffect, useMemo } from 'react'
import { CButton } from '@coreui/react'
import { useHistory } from 'react-router-dom'
import { Button, FormControl, ModalTitle, Modal } from 'react-bootstrap'
import DataTable, { defaultThemes } from 'react-data-table-component'
import { getPendientesAutorizacion } from '../../../../services/getPendientesAutorizacion'
import { useSession } from 'react-use-session'
import { FaList, FaFileUpload, FaUsersCog } from 'react-icons/fa'
import '../../../../scss/estilos.scss'
import DataTableExtensions from 'react-data-table-component-extensions'
import 'react-data-table-component-extensions/dist/index.css'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { getCargaDatos } from '../../../../services/getCargaDatos'

const Pendientes = (prop) => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [data, setListdata] = useState([])
  const [permisos, setPermisos] = useState([])
  const [ocultarBotones, setOcultarBotones] = useState(true)
  const [showCargarNuevos, setShowCargarNuevos] = useState(false)
  const [actualizarTabla, setActualizarTabla] = useState(0)

  useEffect(() => {
    let mounted = true
    let objeto = 'Modulo Autorizacion Pagos'
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getPendientesAutorizacion(prop.tipo, idUsuario).then((items) => {
      if (mounted) {
        setListdata(items.flujos)
      }
    })
    getPerfilUsuario(session.id, '4', objeto).then((items) => {
      if (mounted) {
        setPermisos(items.detalle)
        for (let item of items.detalle) {
          if ('Recargar' == item.descripcion) {
            setOcultarBotones(false)
          }
        }
      }
    })
    return () => (mounted = false)
  }, [actualizarTabla])

  function ExistePermiso(permiso) {
    let result = false
    for (let item of permisos) {
      if (permiso == item.descripcion) {
        result = true
      }
    }
    return result
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

  const formatear = (valor, moneda) => {
    if (moneda === 'QTZ') {
      return formatter.format(valor)
    } else {
      return formatterDolar.format(valor)
    }
  }

  let formatter = new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
  })
  let formatterDolar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  const columns = useMemo(() => [
    {
      name: 'Empresa',
      selector: (row) => row.empresa_nombre,
      center: true,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      wrap: true,
      width: '150px',
    },
    {
      name: 'No.',
      selector: (row) => row.doc_num,
      center: true,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      width: '90px',
    },
    {
      name: 'Fecha Sis.',
      selector: (row) => row.creation_date,
      center: true,
      sortable: true,
      style: {
        fontSize: '11px',
      },
      width: '100px',
    },
    {
      name: 'Beneficiario',
      selector: (row) => row.en_favor_de,
      center: true,
      sortable: true,
      style: {
        fontSize: '11px',
      },
      wrap: true,
      width: '250px',
    },
    {
      name: 'Concepto',
      selector: (row) => row.comments,
      center: true,
      style: {
        fontSize: '11px',
      },
      wrap: true,
      width: '285px',
    },
    {
      name: 'Monto',
      selector: (row) => formatear(row.doc_total, row.doc_curr),
      center: true,
      sortable: true,
      style: {
        fontSize: '11px',
      },
      width: '120px',
    },
    {
      name: 'Acciones',
      cell: function OrderItems(row) {
        let MostrarCargar = ExistePermiso('Cargar')
        let SoloVer = ExistePermiso('Visualizar_completo')
        if (SoloVer) {
          return (
            <div>
              <Button
                data-tag="allowRowEvents"
                variant="success"
                size="sm"
                title="Consultar Detalle Pago"
                onClick={() =>
                  history.push({
                    pathname: '/pagos/tabs',
                    id_flujo: row.id_flujo,
                    pago: row.doc_num,
                    estado: row.estado,
                    nivel: row.nivel,
                    id_grupo: row.id_grupoautorizacion,
                    pagina: 'transferencia',
                  })
                }
              >
                <FaList />
              </Button>
            </div>
          )
        } else {
          if (row.estado == 1) {
            return (
              <div>
                <Button
                  data-tag="allowRowEvents"
                  size="sm"
                  variant="primary"
                  title="Cargar Archivo"
                  className={!MostrarCargar ? 'd-none' : ''}
                  onClick={() =>
                    history.push({
                      pathname: '/archivoflujo/nuevo',
                      id_flujo: row.id_flujo,
                      pago: row.doc_num,
                      grupo: row.id_grupoautorizacion,
                      estado: row.estado,
                    })
                  }
                >
                  <FaFileUpload />
                </Button>{' '}
                <Button
                  data-tag="allowRowEvents"
                  variant="success"
                  size="sm"
                  title="Consultar Detalle Pago"
                  onClick={() =>
                    history.push({
                      pathname: '/pagos/tabs',
                      id_flujo: row.id_flujo,
                      pago: row.doc_num,
                      estado: row.estado,
                      nivel: row.nivel,
                      id_grupo: row.id_grupoautorizacion,
                      pagina: 'transferencia',
                    })
                  }
                >
                  <FaList />
                </Button>
              </div>
            )
          } else if (row.estado == 2) {
            return (
              <div>
                <Button
                  data-tag="allowRowEvents"
                  size="sm"
                  variant="primary"
                  title="Cargar Archivo"
                  className={!MostrarCargar ? 'd-none' : ''}
                  onClick={() =>
                    history.push({
                      pathname: '/archivoflujo/nuevo',
                      id_flujo: row.id_flujo,
                      pago: row.doc_num,
                      grupo: row.id_grupoautorizacion,
                      estado: row.estado,
                    })
                  }
                >
                  <FaFileUpload />
                </Button>{' '}
                <Button
                  data-tag="allowRowEvents"
                  size="sm"
                  variant="primary"
                  title="Asignar Grupo"
                  onClick={() =>
                    history.push({
                      pathname: '/pagos/flujogrupo',
                      id_flujo: row.id_flujo,
                      pago: row.doc_num,
                    })
                  }
                >
                  <FaUsersCog />
                </Button>{' '}
                <Button
                  data-tag="allowRowEvents"
                  variant="success"
                  size="sm"
                  title="Consultar Detalle Pago"
                  onClick={() =>
                    history.push({
                      pathname: '/pagos/tabs',
                      id_flujo: row.id_flujo,
                      pago: row.doc_num,
                      estado: row.estado,
                      nivel: row.nivel,
                      id_grupo: row.id_grupoautorizacion,
                      pagina: 'transferencia',
                    })
                  }
                >
                  <FaList />
                </Button>
              </div>
            )
          } else {
            return (
              <div>
                <Button
                  data-tag="allowRowEvents"
                  size="sm"
                  variant="primary"
                  title="Cargar Archivo"
                  className={!MostrarCargar ? 'd-none' : ''}
                  onClick={() =>
                    history.push({
                      pathname: '/archivoflujo/nuevo',
                      id_flujo: row.id_flujo,
                      pago: row.doc_num,
                      grupo: row.id_grupoautorizacion,
                      estado: row.estado,
                    })
                  }
                >
                  <FaFileUpload />
                </Button>{' '}
                <Button
                  data-tag="allowRowEvents"
                  variant="success"
                  size="sm"
                  title="Consultar Detalle Pago"
                  onClick={() =>
                    history.push({
                      pathname: '/pagos/tabs',
                      id_flujo: row.id_flujo,
                      pago: row.doc_num,
                      estado: row.estado,
                      nivel: row.nivel,
                      id_grupo: row.id_grupoautorizacion,
                      pagina: 'transferencia',
                    })
                  }
                >
                  <FaList />
                </Button>
              </div>
            )
          }
        }
      },
      center: true,
      width: '125px',
    },
  ])
  const tableData = {
    columns,
    data,
    filterPlaceholder: 'Filtrar datos',
    export: false,
    print: false,
  }

  function mostrarModalCargarNuevos() {
    setShowCargarNuevos(true)
  }

  function AccionModalCargarNuevos(opcion) {
    if (opcion == 1) {
      getCargaDatos().then(() => {
        setActualizarTabla(actualizarTabla + 1)
      })

      setShowCargarNuevos(false)
    } else if (opcion == 2) {
      setShowCargarNuevos(false)
    }
  }
  if (session) {
    return (
      <>
        <Modal responsive variant="primary" show={showCargarNuevos} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación</Modal.Title>
          </Modal.Header>
          <Modal.Body>¿Está seguro de cargar nuevos pagos?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => AccionModalCargarNuevos(2)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => AccionModalCargarNuevos(1)}>
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
        <div className={ocultarBotones ? 'd-none float-right' : 'float-right'}>
          <CButton color="success" size="sm" onClick={() => mostrarModalCargarNuevos()}>
            Cargar nuevos pagos
          </CButton>
          <br />
          <br />
        </div>
        <DataTableExtensions {...tableData}>
          <DataTable
            columns={columns}
            noDataComponent="No hay pagos que mostrar"
            data={data}
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

export default Pendientes
