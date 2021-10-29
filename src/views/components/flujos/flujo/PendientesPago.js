import React, { useState, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { Alert, Modal, Button, FormControl } from 'react-bootstrap'
import DataTable, { createTheme } from 'react-data-table-component'
import { getFlujos } from '../../../../services/getFlujos'
import { postFlujos } from '../../../../services/postFlujos'
import { postFlujoDetalle } from '../../../../services/postFlujoDetalle'
import { postNotificacion } from '../../../../services/postNotificacion'
import { useSession } from 'react-use-session'
import { FaList } from 'react-icons/fa'
import '../../../../scss/estilos.scss'

const FilterComponent = (prop) => (
  <div className="div-search">
    <Button
      variant="warning"
      className="btn-compensacion"
      onClick={prop.enviar}
      title="Limpiar Campo Búsqueda"
    >
      Compensar Pagos
    </Button>
    <FormControl
      id="search"
      type="text"
      placeholder="Buscar Pago"
      aria-label="Search Input"
      value={prop.filterText}
      onChange={prop.onFilter}
    />
    <Button
      color="primary"
      className="clear-search"
      onClick={prop.onClear}
      title="Limpiar Campo Búsqueda"
    >
      X
    </Button>
  </div>
)

const PendientesPago = (prop) => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [pagos, setPagos] = useState([])
  const [show, setShow] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [filterText, setFilterText] = useState('')
  const [titulo, setTitulo] = useState('Error!')
  const [color, setColor] = useState('danger')
  const filteredItems = results.filter(
    (item) =>
      item.comments.toLowerCase().includes(filterText.toLowerCase()) ||
      item.doc_date.toLowerCase().includes(filterText.toLowerCase()) ||
      item.doc_num.toLowerCase().includes(filterText.toLowerCase()) ||
      item.activo.toLowerCase().includes(filterText.toLowerCase()),
  )
  const [form, setValues] = useState({
    pagos: '',
  })

  const handleClose = () => setShow(false)

  useEffect(() => {
    let mounted = true
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getFlujos(null, prop.tipo, idUsuario, '2', null, null).then((items) => {
      if (mounted) {
        setList(items.flujos)
      }
    })
    return () => (mounted = false)
  }, [])

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
          await getFlujos(null, prop.tipo, session.id, '2', null, null).then((items) => {
            setList(items.flujos)
          })
        }
      }
    } else {
      setShowAlert(true)
      setTitulo('Error!')
      setColor('danger')
      setMensaje(
        'Los pagos ' +
          respuesta +
          'no fueron compensados debido a que sus códigos bancarios no coinciden con ' +
          'ninguno de los bancos existentes.',
      )
    }
  }

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
    },
    {
      name: 'Número Documento',
      selector: 'doc_num',
      center: true,
      width: '15%',
    },
    {
      name: 'Fecha Documento',
      selector: 'doc_date',
      center: true,
      width: '13%',
    },
    {
      name: 'Detalle',
      selector: 'comments',
      center: true,
      width: '53%',
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
    },
  ])

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle)
        setFilterText('')
      }
    }
    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
        enviar={mostrarModal}
      />
    )
  }, [filterText, resetPaginationToggle])

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

  if (session) {
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
        <DataTable
          columns={columns}
          noDataComponent="No hay pagos que mostrar"
          data={filteredItems}
          customStyles={customStyles}
          theme="solarized"
          pagination
          paginationPerPage={5}
          paginationResetDefaultPage={resetPaginationToggle}
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          persistTableHead
        />
      </>
    )
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default PendientesPago
