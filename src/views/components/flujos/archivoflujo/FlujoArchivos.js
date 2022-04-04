import React, { useState, useEffect, useMemo } from 'react'
import DataTable, { defaultThemes } from 'react-data-table-component'
import { Modal, Button } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import { getArchivosFlujo, getFlujosConArchivos } from '../../../../services/getArchivosFlujo'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { useSession } from 'react-use-session'
import { useHistory } from 'react-router-dom'
import { FaRegFilePdf } from 'react-icons/fa'
import '../../../../scss/estilos.scss'
import DataTableExtensions from 'react-data-table-component-extensions'
import 'react-data-table-component-extensions/dist/index.css'

const FlujoArchivos = () => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [show, setShow] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const filteredItems = results

  useEffect(() => {
    let mounted = true
    getFlujosConArchivos(session.id).then((items) => {
      if (mounted) {
        setList(items.flujos)
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
      const respuesta = await postSesionUsuario(idUsuario, null, null, '2')
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
      name: 'Fecha Doc.',
      selector: (row) => row.doc_date,
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
      style: {
        fontSize: '11px',
      },
      width: '120px',
    },
    {
      name: 'Acciones',
      cell: function OrderItems(row) {
        return (
          <div style={{ alignItems: 'center' }}>
            <Button
              variant="outline-danger"
              size="sm"
              title="Ver archivos"
              onClick={() =>
                history.push({
                  pathname: '/archivoflujo',
                  id_flujo: row.id_flujo,
                })
              }
            >
              <FaRegFilePdf />
            </Button>
          </div>
        )
      },
      center: true,
      width: '70px',
    },
  ])
  const tableData = {
    columns: columns,
    data: filteredItems,
    filterPlaceholder: 'Filtrar datos',
    export: false,
    print: false,
  }

  if (session) {
    return (
      <>
        <Modal responsive variant="primary" show={show} onHide={() => Cancelar(2)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación</Modal.Title>
          </Modal.Header>
          <Modal.Body>{mensaje}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => Cancelar(2)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => Cancelar(1)}>
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
        <DataTableExtensions {...tableData}>
          <DataTable
            columns={columns}
            noDataComponent="No hay archivos que mostrar"
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

export default FlujoArchivos
