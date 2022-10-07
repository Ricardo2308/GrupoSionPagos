import React, { useState, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { Alert, Modal, Button, FormControl } from 'react-bootstrap'
import DataTable, { createTheme, defaultThemes } from 'react-data-table-component'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { getPendientesCompensacion } from '../../../../services/getPendientesCompensacion'
import { postFlujos } from '../../../../services/postFlujos'
import { postFlujoDetalle } from '../../../../services/postFlujoDetalle'
import { postNotificacion } from '../../../../services/postNotificacion'
import { useSession } from 'react-use-session'
import { FaList } from 'react-icons/fa'
import '../../../../scss/estilos.scss'
import DataTableExtensions from 'react-data-table-component-extensions'
import 'react-data-table-component-extensions/dist/index.css'
import { getOcultarColumnaUsuario } from '../../../../services/getOcultarColumnaUsuario'

const FilterComponent = (prop) => (
  <div className="div-search">
    <Button
      variant="warning"
      size="sm"
      className="btn-compensacion"
      onClick={prop.enviar}
      title="Compensar pagos"
      disabled={prop.deshabilitar}
    >
      Compensar Pagos
    </Button>
  </div>
)

const PendientesPago = (prop) => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [permisosRol, setPermisosRol] = useState([])
  const [permisos, setPermisos] = useState([])
  const [pagos, setPagos] = useState([])
  const [show, setShow] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [filterText, setFilterText] = useState('')
  const [titulo, setTitulo] = useState('Error!')
  const [color, setColor] = useState('danger')
  const [MostrarReprocesar, setMostrarReprocesar] = useState(true)
  const [camposOcultos, setListOcultos] = useState([])
  const [anchoConcepto, setAnchoConcepto] = useState('285px')
  const [anchoConcepto2, setAnchoConcepto2] = useState('270px')
  const [desactivarBotonModal, setDesactivarBotonModal] = useState(false)
  const filteredItems = results

  const handleClose = () => setShow(false)

  useEffect(() => {
    let mounted = true
    let objeto = 'Modulo Compensacion Pagos'
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getPendientesCompensacion(prop.tipo, idUsuario, session.api_token).then((items) => {
      if (mounted) {
        setList(items.flujos)
      }
    })
    getPerfilUsuario(idUsuario, '2', objeto, session.api_token).then((items) => {
      if (mounted) {
        setPermisosRol(items.detalle)
      }
    })
    getPerfilUsuario(idUsuario, '4', objeto, session.api_token).then((items) => {
      if (mounted) {
        setPermisos(items.detalle)
        for (let item of items.detalle) {
          if ('Compensar' == item.descripcion) {
            setMostrarReprocesar(false)
          }
        }
      }
    })
    getOcultarColumnaUsuario(session.id, session.api_token).then((items) => {
      if (mounted) {
        setListOcultos(items.ocultar)
        if (items.ocultar.length > 0) {
          setAnchoConcepto('auto')
          setAnchoConcepto2('auto')
        } else {
          setAnchoConcepto('285px')
          setAnchoConcepto2('270px')
        }
      }
    })
    return () => (mounted = false)
  }, [])

  function OcultarCampo(campo) {
    let result = false
    for (let item of camposOcultos) {
      if (campo == item.NombreColumna) {
        result = true
      }
    }
    return result
  }

  function ExistePermisoObjeto(objeto) {
    let result = false
    for (let item of permisosRol) {
      if (objeto == item.objeto) {
        result = true
      }
    }
    return result
  }

  function ExistePermiso(permiso) {
    let result = false
    for (let item of permisos) {
      if (permiso == item.descripcion) {
        result = true
      }
    }
    return result
  }

  const handleInput = (event) => {
    if (event.target.checked) {
      sessionStorage.setItem('Comepnsar_' + event.target.value, 'true')
    } else {
      sessionStorage.setItem('Comepnsar_' + event.target.value, 'false')
    }
  }

  function estaChequeado(item) {
    return sessionStorage.getItem(item) === 'true'
  }

  async function Compensar() {
    setDesactivarBotonModal(true)
    let bandera = 1
    const respuesta = await postFlujos('0', '', '', '2', pagos, session.id, session.api_token)
    if (respuesta === 'OK') {
      for (let pago of pagos) {
        sessionStorage.removeItem('Comepnsar_' + pago)
        const pagado = await postFlujoDetalle(
          pago,
          '7',
          session.id,
          'Compensado',
          '0',
          session.api_token,
        )
        if (pagado === 'OK') {
          bandera *= 1
        } else {
          bandera *= 0
        }
      }
      if (bandera == 1) {
        const enviada = await postNotificacion(
          pagos,
          session.id,
          'compensado.',
          '',
          session.api_token,
        )
        if (enviada == 'OK') {
          await getPendientesCompensacion(prop.tipo, session.id, session.api_token).then(
            (items) => {
              setList(items.flujos)
            },
          )
        }
      }
    } else {
      setShowAlert(true)
      setTitulo('Error!')
      setColor('danger')
      setMensaje(
        `Los pagos ${respuesta} no fueron compensados debido a que sus códigos bancarios no coinciden con ninguno de los bancos existentes.`,
      )
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

  const columns = useMemo(() => {
    if (MostrarReprocesar) {
      return [
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
          omit: OcultarCampo('Empresa'),
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
          omit: OcultarCampo('No. documento'),
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
          omit: OcultarCampo('Fecha sistema'),
        },
        {
          name: 'Fecha auto.',
          selector: (row) => row.aut_date,
          center: true,
          sortable: true,
          style: {
            fontSize: '11px',
          },
          width: '100px',
          omit: OcultarCampo('Fecha autorización'),
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
          omit: OcultarCampo('Beneficiario'),
        },
        {
          name: 'Concepto',
          selector: (row) => row.comments,
          center: true,
          style: {
            fontSize: '11px',
          },
          wrap: true,
          width: anchoConcepto,
          omit: OcultarCampo('Concepto'),
        },
        {
          name: 'Monto',
          selector: (row) => row.doc_total,
          cell: (row) => formatear(row.doc_total, row.doc_curr),
          center: true,
          sortable: true,
          style: {
            fontSize: '11px',
          },
          width: '120px',
          omit: OcultarCampo('Monto'),
        },
        {
          name: 'Acciones',
          cell: function OrderItems(row) {
            return (
              <div style={{ alignItems: 'center' }}>
                <Button
                  data-tag="allowRowEvents"
                  variant="success"
                  size="sm"
                  title="Consultar Detalle Pago"
                  onClick={() =>
                    history.push({
                      pathname: '/compensacion/tabs',
                      id_flujo: row.id_flujo,
                      pago: row.doc_num,
                      deshabilitar: true,
                    })
                  }
                >
                  <FaList />
                </Button>
              </div>
            )
          },
          center: true,
          width: '70px',
          omit: OcultarCampo('Acciones'),
        },
      ]
    } else {
      return [
        {
          cell: function OrderItems(row) {
            if (row.TieneCheque > 0) {
              return (
                <div style={{ alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    name="pagos"
                    key={row.id_flujo}
                    value={row.id_flujo}
                    onChange={handleInput}
                    style={{ width: '18px', height: '18px' }}
                    defaultChecked={estaChequeado('Comepnsar_' + row.id_flujo)}
                  />
                </div>
              )
            } else {
              return (
                <div className="sm">
                  <input
                    className="d-none"
                    type="checkbox"
                    name="pagos"
                    key={row.id_flujo}
                    value={row.id_flujo}
                    onChange={handleInput}
                    style={{ width: '18px', height: '18px' }}
                    defaultChecked={estaChequeado('Comepnsar_' + row.id_flujo)}
                  />
                  sin cheque
                </div>
              )
            }
          },
          center: true,
          width: '7%',
          omit: OcultarCampo('Selección'),
        },
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
          omit: OcultarCampo('Empresa'),
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
          omit: OcultarCampo('No. documento'),
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
          omit: OcultarCampo('Fecha sistema'),
        },
        {
          name: 'Fecha auto.',
          selector: (row) => row.aut_date,
          center: true,
          sortable: true,
          style: {
            fontSize: '11px',
          },
          width: '100px',
          omit: OcultarCampo('Fecha autorización'),
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
          width: '245px',
          omit: OcultarCampo('Beneficiario'),
        },
        {
          name: 'Concepto',
          selector: (row) => row.comments,
          center: true,
          style: {
            fontSize: '11px',
          },
          wrap: true,
          width: anchoConcepto2,
          omit: OcultarCampo('Concepto'),
        },
        {
          name: 'Monto',
          selector: (row) => row.doc_total,
          cell: (row) => formatear(row.doc_total, row.doc_curr),
          center: true,
          sortable: true,
          style: {
            fontSize: '11px',
          },
          width: '120px',
          omit: OcultarCampo('Monto'),
        },
        {
          name: 'Acciones',
          cell: function OrderItems(row) {
            return (
              <div style={{ alignItems: 'center' }}>
                <Button
                  data-tag="allowRowEvents"
                  variant="success"
                  size="sm"
                  title="Consultar Detalle Pago"
                  onClick={() =>
                    history.push({
                      pathname: '/compensacion/tabs',
                      id_flujo: row.id_flujo,
                      pago: row.doc_num,
                      deshabilitar: true,
                    })
                  }
                >
                  <FaList />
                </Button>
              </div>
            )
          },
          center: true,
          width: '80px',
          omit: OcultarCampo('Acciones'),
        },
      ]
    }
  })

  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle)
      setFilterText('')
    }
  }

  function mostrarModal() {
    let pagos = []
    //var markedCheckbox = document.getElementsByName('pagos')
    //for (var checkbox of markedCheckbox) {
    filteredItems.map((row) => {
      if (estaChequeado('Comepnsar_' + row.id_flujo)) {
        pagos.push(row.id_flujo)
      }
    })
    if (pagos.length > 0) {
      setShow(true)
      setPagos(pagos)
    } else {
      setShowAlert(true)
      setTitulo('Error!')
      setColor('danger')
      setMensaje('No has seleccionado ningún pago.')
    }
  }

  const tableData = {
    columns: columns,
    data: filteredItems,
    filterPlaceholder: 'Filtrar datos',
    export: false,
    print: false,
  }

  if (session) {
    let deshabilitar = false

    if (!ExistePermisoObjeto('Modulo Compensacion Pagos')) {
      deshabilitar = true
    }
    return (
      <>
        <Alert show={showAlert} variant={color} onClose={() => setShowAlert(false)} dismissible>
          <Alert.Heading>{titulo}</Alert.Heading>
          <p>{mensaje}</p>
        </Alert>
        <Modal responsive variant="primary" show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación</Modal.Title>
          </Modal.Header>
          <Modal.Body>Está seguro de compensar este pago?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              disabled={desactivarBotonModal}
              variant="primary"
              onClick={() => Compensar().then(handleClose)}
            >
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
        <div
          className={MostrarReprocesar ? 'd-none float-right' : 'float-right'}
          style={{ marginBottom: '10px' }}
        >
          <FilterComponent
            onFilter={(e) => setFilterText(e.target.value)}
            onClear={handleClear}
            filterText={filterText}
            enviar={mostrarModal}
            deshabilitar={deshabilitar}
          />
        </div>
        <DataTableExtensions {...tableData}>
          <DataTable
            columns={columns}
            noDataComponent="No hay pagos que mostrar"
            data={filteredItems}
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

export default PendientesPago
