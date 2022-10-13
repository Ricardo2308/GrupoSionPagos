import React, { useState, useEffect, useMemo } from 'react'
import { CButton } from '@coreui/react'
import { useHistory } from 'react-router-dom'
import { Button, FormControl, ModalTitle, Modal } from 'react-bootstrap'
import DataTable, { defaultThemes } from 'react-data-table-component'
import { getRecordatorioPorUsuario } from '../../../../services/getRecordatorioUsuario'
import { useSession } from 'react-use-session'
import { FaList, FaFileUpload, FaUsersCog } from 'react-icons/fa'
import '../../../../scss/estilos.scss'
import DataTableExtensions from 'react-data-table-component-extensions'
import 'react-data-table-component-extensions/dist/index.css'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { postFlujos } from '../../../../services/postFlujos'
import { postFlujoDetalle } from '../../../../services/postFlujoDetalle'
import { postNotificacion } from '../../../../services/postNotificacion'
import { getOcultarColumnaUsuario } from '../../../../services/getOcultarColumnaUsuario'

const PendientesRecordatorio = (prop) => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [data, setListdata] = useState([])
  const [permisos, setPermisos] = useState([])
  const [showModalAutorizar, setShowModalAutorizar] = useState(false)
  const [showAutorizar, setShowAutorizar] = useState(false)
  const [actualizarTabla, setActualizarTabla] = useState(0)
  const [camposOcultos, setListOcultos] = useState([])
  const [anchoConcepto, setAnchoConcepto] = useState('285px')
  const [desactivarBotonModal, setDesactivarBotonModal] = useState(false)
  const OrdenarPorColumna = sessionStorage.getItem('OrdenarPorColumnaPR')
  const OrdenarPorDireccion = sessionStorage.getItem('OrdenarPorDireccionPR')

  useEffect(() => {
    let mounted = true
    let objeto = 'Modulo Autorizacion Pagos'
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getRecordatorioPorUsuario(idUsuario, session.api_token).then((items) => {
      if (mounted) {
        if (OrdenarPorColumna !== null && OrdenarPorDireccion !== null) {
          if (OrdenarPorColumna == 'Empresa' && OrdenarPorDireccion == 'asc') {
            items.flujos.sort((a, b) =>
              a.empresa_nombre > b.empresa_nombre
                ? 1
                : b.empresa_nombre > a.empresa_nombre
                ? -1
                : 0,
            )
          }
          if (OrdenarPorColumna == 'Empresa' && OrdenarPorDireccion == 'desc') {
            items.flujos.sort((a, b) =>
              a.empresa_nombre > b.empresa_nombre
                ? -1
                : b.empresa_nombre > a.empresa_nombre
                ? 1
                : 0,
            )
          }
          if (OrdenarPorColumna == 'No.' && OrdenarPorDireccion == 'asc') {
            items.flujos.sort((a, b) =>
              a.doc_num > b.doc_num ? 1 : b.doc_num > a.doc_num ? -1 : 0,
            )
          }
          if (OrdenarPorColumna == 'No.' && OrdenarPorDireccion == 'desc') {
            items.flujos.sort((a, b) =>
              a.doc_num > b.doc_num ? -1 : b.doc_num > a.doc_num ? 1 : 0,
            )
          }
          if (OrdenarPorColumna == 'Fecha Sis.' && OrdenarPorDireccion == 'asc') {
            items.flujos.sort((a, b) =>
              a.creation_date > b.creation_date ? 1 : b.creation_date > a.creation_date ? -1 : 0,
            )
          }
          if (OrdenarPorColumna == 'Fecha Sis.' && OrdenarPorDireccion == 'desc') {
            items.flujos.sort((a, b) =>
              a.creation_date > b.creation_date ? -1 : b.creation_date > a.creation_date ? 1 : 0,
            )
          }
          if (OrdenarPorColumna == 'Beneficiario' && OrdenarPorDireccion == 'asc') {
            items.flujos.sort((a, b) =>
              a.en_favor_de > b.en_favor_de ? 1 : b.en_favor_de > a.en_favor_de ? -1 : 0,
            )
          }
          if (OrdenarPorColumna == 'Beneficiario' && OrdenarPorDireccion == 'desc') {
            items.flujos.sort((a, b) =>
              a.en_favor_de > b.en_favor_de ? -1 : b.en_favor_de > a.en_favor_de ? 1 : 0,
            )
          }
          if (OrdenarPorColumna == 'Concepto' && OrdenarPorDireccion == 'asc') {
            items.flujos.sort((a, b) =>
              a.comments > b.comments ? 1 : b.comments > a.comments ? -1 : 0,
            )
          }
          if (OrdenarPorColumna == 'Concepto' && OrdenarPorDireccion == 'desc') {
            items.flujos.sort((a, b) =>
              a.comments > b.comments ? -1 : b.comments > a.comments ? 1 : 0,
            )
          }
          if (OrdenarPorColumna == 'Monto' && OrdenarPorDireccion == 'asc') {
            items.flujos.sort((a, b) =>
              parseFloat(a.doc_total) > parseFloat(b.doc_total)
                ? 1
                : parseFloat(b.doc_total) > parseFloat(a.doc_total)
                ? -1
                : 0,
            )
          }
          if (OrdenarPorColumna == 'Monto' && OrdenarPorDireccion == 'desc') {
            items.flujos.sort((a, b) =>
              parseFloat(a.doc_total) > parseFloat(b.doc_total)
                ? -1
                : parseFloat(b.doc_total) > parseFloat(a.doc_total)
                ? 1
                : 0,
            )
          }
        }
        setListdata(items.flujos)
        let datosOrdenados = []
        items.flujos.forEach((item) => {
          datosOrdenados.push({
            id_flujo: item.id_flujo,
            estado: item.estado,
            nivel: item.nivel,
            id_grupo: item.id_grupoautorizacion,
            PuedoAutorizar: item.PuedoAutorizar,
            pago: item.doc_num,
          })
        })
        sessionStorage.setItem('listaPagos', JSON.stringify(datosOrdenados))
      }
    })
    getPerfilUsuario(session.id, '4', objeto, session.api_token).then((items) => {
      if (mounted) {
        setPermisos(items.detalle)
      }
    })
    getOcultarColumnaUsuario(session.id, session.api_token).then((items) => {
      if (mounted) {
        setListOcultos(items.ocultar)
        if (items.ocultar.length > 0) {
          setAnchoConcepto('auto')
        } else {
          setAnchoConcepto('285px')
        }
      }
    })
    return () => (mounted = false)
  }, [actualizarTabla])

  function OcultarCampo(campo) {
    let result = false
    for (let item of camposOcultos) {
      if (campo == item.NombreColumna) {
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

  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: 'TODOS',
  }

  const columns = useMemo(() => [
    {
      name: ' ',
      cell: function OrderItems(row) {
        let tienePermisoAutorizar = ExistePermiso('Autorizar')
        if (row.PuedoAutorizar == 1 && tienePermisoAutorizar) {
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
      omit: OcultarCampo('Selección'),
    },
    {
      id: 'Empresa',
      name: 'Empresa',
      selector: (row) => row.empresa_nombre,
      center: false,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      wrap: true,
      width: '150px',
      omit: OcultarCampo('Empresa'),
    },
    {
      id: 'No.',
      name: 'No.',
      selector: (row) => row.doc_num,
      center: false,
      style: {
        fontSize: '11px',
      },
      sortable: true,
      width: '90px',
      omit: OcultarCampo('No. documento'),
    },
    {
      id: 'Fecha Sis.',
      name: 'Fecha Sis.',
      selector: (row) => row.creation_date,
      center: false,
      sortable: true,
      style: {
        fontSize: '11px',
      },
      width: '100px',
      omit: OcultarCampo('Fecha sistema'),
    },
    {
      id: 'Beneficiario',
      name: 'Beneficiario',
      selector: (row) => row.en_favor_de,
      center: false,
      sortable: true,
      style: {
        fontSize: '11px',
      },
      wrap: true,
      width: '250px',
      omit: OcultarCampo('Beneficiario'),
    },
    {
      id: 'Concepto',
      name: 'Concepto',
      selector: (row) => row.comments,
      center: false,
      sortable: true,
      style: {
        fontSize: '11px',
      },
      wrap: true,
      width: anchoConcepto,
      omit: OcultarCampo('Concepto'),
    },
    {
      id: 'Monto',
      name: 'Monto',
      selector: (row) => row.doc_total,
      cell: (row) => formatear(row.doc_total, row.doc_curr),
      right: true,
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
                    seccion: 'Pendientes',
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
                      seccion: 'Pendientes',
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
                      seccion: 'Pendientes',
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
                      seccion: 'Pendientes',
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
      omit: OcultarCampo('Acciones'),
    },
  ])
  const tableData = {
    columns,
    data,
    filterPlaceholder: 'Filtrar datos',
    export: false,
    print: false,
  }

  function mostrarModalAutorizar() {
    setShowModalAutorizar(true)
  }

  function Ordenamiento(columna, direccion, e) {
    if (columna.name !== undefined) {
      sessionStorage.setItem('OrdenarPorColumnaPR', columna.name)
    }
    if (direccion) {
      sessionStorage.setItem('OrdenarPorDireccionPR', direccion)
    }
    if (columna.name == 'Empresa' && direccion == 'asc') {
      data.sort(function (a, b) {
        if (a.empresa_nombre > b.empresa_nombre) {
          return 1
        }
        if (a.empresa_nombre < b.empresa_nombre) {
          return -1
        }
        return 0
      })
    }
    if (columna.name == 'Empresa' && direccion == 'desc') {
      data.sort(function (a, b) {
        if (a.empresa_nombre > b.empresa_nombre) {
          return -1
        }
        if (a.empresa_nombre < b.empresa_nombre) {
          return 1
        }
        return 0
      })
    }
    if (columna.name == 'No.' && direccion == 'asc') {
      data.sort(function (a, b) {
        if (a.doc_num > b.doc_num) {
          return 1
        }
        if (a.doc_num < b.doc_num) {
          return -1
        }
        return 0
      })
    }
    if (columna.name == 'No.' && direccion == 'desc') {
      data.sort(function (a, b) {
        if (a.doc_num > b.doc_num) {
          return -1
        }
        if (a.doc_num < b.doc_num) {
          return 1
        }
        return 0
      })
    }
    if (columna.name == 'Fecha Sis.' && direccion == 'asc') {
      data.sort(function (a, b) {
        if (a.creation_date > b.creation_date) {
          return 1
        }
        if (a.creation_date < b.creation_date) {
          return -1
        }
        return 0
      })
    }
    if (columna.name == 'Fecha Sis.' && direccion == 'desc') {
      data.sort(function (a, b) {
        if (a.creation_date > b.creation_date) {
          return -1
        }
        if (a.creation_date < b.creation_date) {
          return 1
        }
        return 0
      })
    }
    if (columna.name == 'Beneficiario' && direccion == 'asc') {
      data.sort(function (a, b) {
        if (a.en_favor_de > b.en_favor_de) {
          return 1
        }
        if (a.en_favor_de < b.en_favor_de) {
          return -1
        }
        return 0
      })
    }
    if (columna.name == 'Beneficiario' && direccion == 'desc') {
      data.sort(function (a, b) {
        if (a.en_favor_de > b.en_favor_de) {
          return -1
        }
        if (a.en_favor_de < b.en_favor_de) {
          return 1
        }
        return 0
      })
    }
    if (columna.name == 'Concepto' && direccion == 'asc') {
      data.sort(function (a, b) {
        if (a.comments > b.comments) {
          return 1
        }
        if (a.comments < b.comments) {
          return -1
        }
        return 0
      })
    }
    if (columna.name == 'Concepto' && direccion == 'desc') {
      data.sort(function (a, b) {
        if (a.comments > b.comments) {
          return -1
        }
        if (a.comments < b.comments) {
          return 1
        }
        return 0
      })
    }
    if (columna.name == 'Monto' && direccion == 'asc') {
      data.sort(function (a, b) {
        if (parseFloat(a.doc_total) > parseFloat(b.doc_total)) {
          return 1
        }
        if (parseFloat(a.doc_total) < parseFloat(b.doc_total)) {
          return -1
        }
        return 0
      })
    }
    if (columna.name == 'Monto' && direccion == 'desc') {
      data.sort(function (a, b) {
        if (parseFloat(a.doc_total) > parseFloat(b.doc_total)) {
          return -1
        }
        if (parseFloat(a.doc_total) < parseFloat(b.doc_total)) {
          return 1
        }
        return 0
      })
    }
    let datosOrdenados = []
    data.forEach((item) => {
      datosOrdenados.push({
        id_flujo: item.id_flujo,
        estado: item.estado,
        nivel: item.nivel,
        id_grupo: item.id_grupoautorizacion,
        PuedoAutorizar: item.PuedoAutorizar,
        pago: item.doc_num,
      })
    })
    sessionStorage.setItem('listaPagos', JSON.stringify(datosOrdenados))
    return true
  }

  async function AccionModalAutorizar(opcion) {
    setDesactivarBotonModal(true)
    if (opcion == 1) {
      let pagos = []
      var markedCheckbox = document.getElementsByName('autorizarPago')
      for (var checkbox of markedCheckbox) {
        if (checkbox.checked) {
          let valorPago = checkbox.value
          let partes = checkbox.value.split('|')
          if (partes[1] == 3) {
            await postFlujos(partes[0], '2', '', '', null, session.id, session.api_token)
            await postFlujoDetalle(partes[0], '4', session.id, 'Aprobado', '1', session.api_token)
            sessionStorage.removeItem(valorPago)
          } else if (partes[1] == 4) {
            const respuesta = await postFlujos(
              partes[0],
              partes[2],
              '',
              '',
              null,
              session.id,
              session.api_token,
            )
            if (respuesta == 'OK') {
              await postFlujoDetalle(
                partes[0],
                '4',
                session.id,
                'Aprobado',
                partes[2],
                session.api_token,
              )
              sessionStorage.removeItem(valorPago)
            } else if (respuesta == 'Finalizado') {
              const finalizado = await postFlujoDetalle(
                partes[0],
                '5',
                session.id,
                'Autorización completa',
                partes[2],
                session.api_token,
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
        await postNotificacion(pagos, session.id, 'autorizado por completo.', '', session.api_token)
      }
      setActualizarTabla(actualizarTabla + 1)
      setShowModalAutorizar(false)
    } else if (opcion == 2) {
      setShowModalAutorizar(false)
    }
    setDesactivarBotonModal(false)
  }

  if (session) {
    return (
      <>
        <Modal responsive variant="primary" show={showModalAutorizar} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación</Modal.Title>
          </Modal.Header>
          <Modal.Body>¿Está seguro de autorizar los pagos seleccionados?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => AccionModalAutorizar(2)}>
              Cancelar
            </Button>
            <Button
              disabled={desactivarBotonModal}
              variant="primary"
              onClick={() => AccionModalAutorizar(1)}
            >
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
        <div>
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
            onSort={Ordenamiento}
            dense
            paginationRowsPerPageOptions={[25, 50, 100, 300]}
            paginationComponentOptions={paginationComponentOptions}
            defaultSortAsc={OrdenarPorDireccion == 'asc' ? true : false}
            defaultSortFieldId={OrdenarPorColumna}
          />
        </DataTableExtensions>
      </>
    )
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default PendientesRecordatorio
