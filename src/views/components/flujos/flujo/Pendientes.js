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
import { postFlujos } from '../../../../services/postFlujos'
import { postFlujoDetalle } from '../../../../services/postFlujoDetalle'
import { postNotificacion } from '../../../../services/postNotificacion'

const Pendientes = (prop) => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [data, setListdata] = useState([])
  const [permisos, setPermisos] = useState([])
  const [ocultarBotonCargar, setocultarBotonCargar] = useState(true)
  const [showCargarNuevos, setShowCargarNuevos] = useState(false)
  const [showModalAutorizar, setShowModalAutorizar] = useState(false)
  const [showAutorizar, setShowAutorizar] = useState(false)
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
            setocultarBotonCargar(false)
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

  function estaChequeado(item) {
    return sessionStorage.getItem(item) === 'true'
  }

  const handleInput = (event) => {
    if (event.target.checked) {
      sessionStorage.setItem(event.target.value, 'true')
    } else {
      sessionStorage.setItem(event.target.value, 'false')
    }
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
      name: ' ',
      cell: function OrderItems(row) {
        if (row.PuedoAutorizar == 1) {
          setShowAutorizar(true)
          return (
            <div>
              <input
                type="checkbox"
                name="autorizarPago"
                key={row.id_flujo}
                value={row.id_flujo + '|' + row.estado + '|' + row.nivel}
                style={{ width: '18px', height: '18px' }}
                onChange={handleInput}
                defaultChecked={estaChequeado(row.id_flujo + '|' + row.estado + '|' + row.nivel)}
              />
            </div>
          )
        }
      },
      center: true,
      width: '35px',
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
                    PuedoAutorizar: row.PuedoAutorizar,
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
                      PuedoAutorizar: row.PuedoAutorizar,
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
                      PuedoAutorizar: row.PuedoAutorizar,
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
                      PuedoAutorizar: row.PuedoAutorizar,
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

  function mostrarModalAutorizar() {
    setShowModalAutorizar(true)
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

  async function AccionModalAutorizar(opcion) {
    if (opcion == 1) {
      let pagos = []
      var markedCheckbox = document.getElementsByName('autorizarPago')
      for (var checkbox of markedCheckbox) {
        if (checkbox.checked) {
          let valorPago = checkbox.value
          let partes = checkbox.value.split('|')
          if (partes[1] == 3) {
            await postFlujos(partes[0], '2', '', '', null, session.id)
            await postFlujoDetalle(partes[0], '4', session.id, 'Aprobado', '1')
            sessionStorage.removeItem(valorPago)
          } else if (partes[1] == 4) {
            const respuesta = await postFlujos(partes[0], partes[2], '', '', null, session.id)
            if (respuesta == 'OK') {
              await postFlujoDetalle(partes[0], '4', session.id, 'Aprobado', partes[2])
              sessionStorage.removeItem(valorPago)
            } else if (respuesta == 'Finalizado') {
              const finalizado = await postFlujoDetalle(
                partes[0],
                '5',
                session.id,
                'Autorización completa',
                partes[2],
              )
              if (finalizado == 'OK') {
                pagos.push(partes[0])
                sessionStorage.removeItem(valorPago)
              }
            }
          }
        }
      }
      if (pagos.length > 0) {
        await postNotificacion(pagos, session.id, 'autorizado por completo.', '')
      }
      console.log(pagos)
      setActualizarTabla(actualizarTabla + 1)
      setShowModalAutorizar(false)
    } else if (opcion == 2) {
      setShowModalAutorizar(false)
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
        <Modal responsive variant="primary" show={showModalAutorizar} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación</Modal.Title>
          </Modal.Header>
          <Modal.Body>¿Está seguro de autorizar los pagos seleccionados?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => AccionModalAutorizar(2)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => AccionModalAutorizar(1)}>
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
        <div>
          <CButton
            className={ocultarBotonCargar ? 'd-none float-right' : 'float-right'}
            color="success"
            size="sm"
            onClick={() => mostrarModalCargarNuevos()}
          >
            Cargar nuevos pagos
          </CButton>
          {'  '}
          <CButton
            className={!showAutorizar ? 'd-none float-right' : 'float-right'}
            color="primary"
            size="sm"
            onClick={() => mostrarModalAutorizar()}
          >
            Autorizar pagos seleccionados
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
