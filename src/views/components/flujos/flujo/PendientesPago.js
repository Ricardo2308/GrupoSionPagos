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

const FilterComponent = (prop) => (
  <div className="div-search">
    <Button
      variant="warning"
      size="sm"
      className="btn-compensacion"
      onClick={prop.enviar}
      title="Limpiar Campo Búsqueda"
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
  const [permisos, setPermisos] = useState([])
  const [pagos, setPagos] = useState([])
  const [show, setShow] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [filterText, setFilterText] = useState('')
  const [titulo, setTitulo] = useState('Error!')
  const [color, setColor] = useState('danger')
  const filteredItems = results
  const [form, setValues] = useState({
    pagos: '',
  })

  const handleClose = () => setShow(false)

  useEffect(() => {
    let mounted = true
    let objeto = 'Modulo Compensacion Pagos'
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getPendientesCompensacion(prop.tipo, idUsuario).then((items) => {
      if (mounted) {
        setList(items.flujos)
      }
    })
    getPerfilUsuario(idUsuario, '2', objeto).then((items) => {
      if (mounted) {
        setPermisos(items.detalle)
      }
    })
    return () => (mounted = false)
  }, [])

  function ExistePermiso(objeto) {
    let result = false
    for (let item of permisos) {
      if (objeto == item.objeto) {
        result = true
      }
    }
    return result
  }

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  async function Compensar() {
    let bandera = 1
    const respuesta = await postFlujos('0', '', '', '2', pagos)
    if (respuesta === 'OK') {
      for (let pago of pagos) {
        const pagado = await postFlujoDetalle(pago, '7', session.id, 'Compensado', '0')
        if (pagado === 'OK') {
          bandera *= 1
        } else {
          bandera *= 0
        }
      }
      if (bandera == 1) {
        const enviada = await postNotificacion(pagos, session.id, 'compensado.', '')
        if (enviada == 'OK') {
          await getPendientesCompensacion(prop.tipo, session.id).then((items) => {
            setList(items.flujos)
          })
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
      cell: function OrderItems(row) {
        return (
          <div style={{ alignItems: 'center' }}>
            <input
              type="checkbox"
              name="pagos"
              key={row.id_flujo}
              value={row.id_flujo}
              onChange={handleInput}
              style={{ width: '18px', height: '18px' }}
            />
          </div>
        )
      },
      center: true,
      width: '6%',
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
      width: '12%',
    },
    {
      name: 'No.',
      selector: (row) => row.doc_num,
      center: true,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      width: '8%',
    },
    {
      name: 'Fecha Documento',
      selector: (row) => row.doc_date,
      center: true,
      sortable: true,
      style: {
        fontSize: '11px',
      },
      width: '10%',
    },
    {
      name: 'Beneficiario',
      selector: (row) => row.card_name,
      center: true,
      sortable: true,
      style: {
        fontSize: '11px',
      },
      wrap: true,
    },
    {
      name: 'Concepto',
      selector: (row) => row.comments,
      center: true,
      style: {
        fontSize: '11px',
      },
      wrap: true,
    },
    {
      name: 'Monto',
      selector: (row) => formatear(row.doc_total, row.doc_curr),
      center: true,
      style: {
        fontSize: '11px',
      },
      width: '12%',
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
      width: '8%',
    },
  ])

  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle)
      setFilterText('')
    }
  }

  function mostrarModal() {
    let pagos = []
    var markedCheckbox = document.getElementsByName('pagos')
    for (var checkbox of markedCheckbox) {
      if (checkbox.checked) {
        pagos.push(checkbox.value)
      }
    }
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
    if (!ExistePermiso('Modulo Compensacion Pagos')) {
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
            <Button variant="primary" onClick={() => Compensar().then(handleClose)}>
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="float-right" style={{ marginBottom: '10px' }}>
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
