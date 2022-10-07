import React, { useState, useEffect, useMemo } from 'react'
import { CButton } from '@coreui/react'
import { useHistory, useLocation } from 'react-router-dom'
import {
  Button,
  FormControl,
  ModalTitle,
  Modal,
  Tooltip,
  OverlayTrigger,
  Alert,
} from 'react-bootstrap'
import DataTable, { defaultThemes } from 'react-data-table-component'
import { getPendientesAutorizacion } from '../../../../services/getPendientesAutorizacion'
import { useSession } from 'react-use-session'
import { FaList, FaFileUpload, FaUsersCog, FaCircle, FaFlag } from 'react-icons/fa'
import '../../../../scss/estilos.scss'
import DataTableExtensions from 'react-data-table-component-extensions'
import 'react-data-table-component-extensions/dist/index.css'
import { getPerfilUsuario } from '../../../../services/getPerfilUsuario'
import { getCargaDatos } from '../../../../services/getCargaDatos'
import { postFlujos } from '../../../../services/postFlujos'
import { postFlujoDetalle } from '../../../../services/postFlujoDetalle'
import { postNotificacion } from '../../../../services/postNotificacion'
import { postRecordatorioUsuario } from '../../../../services/postRecordatorioUsuario'
import styled from 'styled-components'
import { getOcultarColumnaUsuario } from '../../../../services/getOcultarColumnaUsuario'
import { getUsuarioRecordatorioGrupo } from '../../../../services/getUsuarioRecordatorioGrupo'

const Pendientes = (prop) => {
  const history = useHistory()
  const location = useLocation()
  const { session } = useSession('PendrogonIT-Session')
  const [data, setListdata] = useState([])
  const [dataOriginal, setDataOriginal] = useState([])
  const [permisos, setPermisos] = useState([])
  const [ocultarBotonCargar, setocultarBotonCargar] = useState(true)
  const [showCargarNuevos, setShowCargarNuevos] = useState(false)
  const [showModalAutorizar, setShowModalAutorizar] = useState(false)
  const [showAutorizar, setShowAutorizar] = useState(false)
  const [actualizarTabla, setActualizarTabla] = useState(0)
  //Cambio recordatorio
  const [showModalRecordar, setShowModalRecordar] = useState(false)
  const [showModalConDuda, setShowModalConDuda] = useState(false)
  const [columnaOrden, setColumnaOrden] = useState('')
  const [direccionOrden, setDireccionOrden] = useState('')
  const [actualizarColor, setActualizarColor] = useState(true)
  const [camposOcultos, setListOcultos] = useState([])
  const [anchoConcepto, setAnchoConcepto] = useState('285px')
  const [PuedeEnviarRecordatorio, setPuedeEnviarRecordatorio] = useState(false)
  const [show, setShow] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [color, setColor] = useState('danger')
  const [titulo, setTitulo] = useState('Error!')
  const [desactivarBotonModal, setDesactivarBotonModal] = useState(false)

  const StyledCell = styled.div`
    &.VERDE {
      background: #9cff84 !important;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &.AMARILLO {
      background: #ffff84 !important;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &.ROJO {
      background: #ff8484 !important;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &.AZUL {
      background: #b7d7e8 !important;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &.NO {
      background: transparent !important;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `

  useEffect(() => {
    let colorFiltro = 'NO'
    if (location.colorFiltro !== undefined) {
      colorFiltro = location.colorFiltro
    }
    let mounted = true
    let objeto = 'Modulo Autorizacion Pagos'
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getPendientesAutorizacion(prop.tipo, idUsuario, session.api_token).then((items) => {
      if (mounted) {
        setDataOriginal(items.flujos)
        if (colorFiltro === 'NO') {
          setListdata(items.flujos)
        } else {
          setListdata(
            items.flujos.filter(function (pago) {
              return pago.colorSemaforo == colorFiltro
            }),
          )
        }
        let datosOrdenados = []
        items.flujos.forEach((item) => {
          if (colorFiltro === 'NO') {
            datosOrdenados.push({
              id_flujo: item.id_flujo,
              estado: item.estado,
              nivel: item.nivel,
              id_grupo: item.id_grupoautorizacion,
              PuedoAutorizar: item.PuedoAutorizar,
              pago: item.doc_num,
              seccion: 'Pendientes',
            })
          } else {
            if (item.colorSemaforo == colorFiltro) {
              datosOrdenados.push({
                id_flujo: item.id_flujo,
                estado: item.estado,
                nivel: item.nivel,
                id_grupo: item.id_grupoautorizacion,
                PuedoAutorizar: item.PuedoAutorizar,
                pago: item.doc_num,
                seccion: 'Pendientes',
              })
            }
          }
        })
        sessionStorage.setItem('listaPagos', JSON.stringify(datosOrdenados))
      }
    })
    getPerfilUsuario(session.id, '4', objeto, session.api_token).then((items) => {
      if (mounted) {
        setPermisos(items.detalle)
        for (let item of items.detalle) {
          if ('Recargar' == item.descripcion) {
            setocultarBotonCargar(false)
          }
        }
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
    getUsuarioRecordatorioGrupo(session.id, session.api_token).then((items) => {
      if (items.recordatorio.length > 0) {
        setPuedeEnviarRecordatorio(true)
      } else {
        setPuedeEnviarRecordatorio(false)
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

  const columns = useMemo(() => [
    {
      name: ' ',
      cell: function OrderItems(row) {
        let tienePermisoAutorizar = ExistePermiso('Autorizar')
        if (row.PuedoAutorizar == 1 && tienePermisoAutorizar) {
          setShowAutorizar(true)
          return (
            <StyledCell className={row.colorSemaforo}>
              <input
                type="checkbox"
                name="autorizarPago"
                key={row.id_flujo}
                value={row.id_flujo + '|' + row.estado + '|' + row.nivel}
                style={{ width: '18px', height: '18px' }}
                onChange={handleInput}
                defaultChecked={estaChequeado(row.id_flujo + '|' + row.estado + '|' + row.nivel)}
              />
            </StyledCell>
          )
        }
      },
      center: false,
      width: '35px',
      style: {
        paddingLeft: '0px',
        paddingRight: '0px',
      },
      omit: OcultarCampo('Selección'),
    },
    {
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
      name: 'Concepto',
      selector: (row) => row.comments,
      center: false,
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
                      concepto: row.comments,
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
              <div style={{}}>
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
                      concepto: row.comments,
                    })
                  }
                >
                  <FaFileUpload />
                </Button>{' '}
                {/* <Button
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
                </Button>{' '} */}
                <Button
                  data-tag="allowRowEvents"
                  variant="warning"
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
                  {/* <FaList /> */}
                  <FaFlag style={{ color: 'white' }} />
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
                      concepto: row.comments,
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
      center: false,
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

  function mostrarModalCargarNuevos() {
    setShowCargarNuevos(true)
  }

  function mostrarModalAutorizar() {
    setShowModalAutorizar(true)
  }

  function mostrarModalRecordar() {
    setShowModalRecordar(true)
  }

  function mostrarModalConDuda() {
    setShowModalConDuda(true)
  }

  function AccionModalCargarNuevos(opcion) {
    setDesactivarBotonModal(true)
    if (opcion == 1) {
      getCargaDatos(session.api_token).then(() => {
        setActualizarTabla(actualizarTabla + 1)
      })

      setShowCargarNuevos(false)
    } else if (opcion == 2) {
      setShowCargarNuevos(false)
    }
    setDesactivarBotonModal(false)
  }

  function Ordenamiento(columna, direccion, e) {
    setColumnaOrden(columna)
    setDireccionOrden(direccion)
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
    if (columna.name == 'Monto' && direccion == 'asc') {
      data.sort(function (a, b) {
        //if (formatear(a.doc_total, a.doc_curr) > formatear(b.doc_total, b.doc_curr)) {
        if (parseFloat(a.doc_total) > parseFloat(b.doc_total)) {
          return 1
        }
        //if (formatear(a.doc_total, a.doc_curr) < formatear(b.doc_total, b.doc_curr)) {
        if (parseFloat(a.doc_total) < parseFloat(b.doc_total)) {
          return -1
        }
        return 0
      })
    }
    if (columna.name == 'Monto' && direccion == 'desc') {
      data.sort(function (a, b) {
        //if (formatear(a.doc_total, a.doc_curr) > formatear(b.doc_total, b.doc_curr)) {
        if (parseFloat(a.doc_total) > parseFloat(b.doc_total)) {
          return -1
        }
        //if (formatear(a.doc_total, a.doc_curr) < formatear(b.doc_total, b.doc_curr)) {
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
        seccion: 'Pendientes',
      })
    })
    sessionStorage.setItem('listaPagos', JSON.stringify(datosOrdenados))
    return true
  }

  async function AccionModalAutorizar(opcion) {
    setDesactivarBotonModal(true)
    if (opcion == 1) {
      let pagos = []
      //var markedCheckbox = document.getElementsByName('autorizarPago')
      //for (var checkbox of markedCheckbox) {
      data.map(async (row) => {
        if (estaChequeado(row.id_flujo + '|' + row.estado + '|' + row.nivel)) {
          let valorPago = row.id_flujo + '|' + row.estado + '|' + row.nivel
          //let partes = checkbox.value.split('|')
          if (row.estado == 3) {
            await postFlujos(row.id_flujo, '1', '', '', null, session.id, session.api_token)
            await postFlujoDetalle(
              row.id_flujo,
              '4',
              session.id,
              'Aprobado',
              '1',
              session.api_token,
            )
            sessionStorage.removeItem(valorPago)
          } else if (row.estado == 4) {
            const respuesta = await postFlujos(
              row.id_flujo,
              row.nivel,
              '',
              '',
              null,
              session.id,
              session.api_token,
            )
            if (respuesta == 'OK') {
              await postFlujoDetalle(
                row.id_flujo,
                '4',
                session.id,
                'Aprobado',
                row.nivel,
                session.api_token,
              )
              sessionStorage.removeItem(valorPago)
            } else if (respuesta == 'Finalizado') {
              const finalizado = await postFlujoDetalle(
                row.id_flujo,
                '5',
                session.id,
                'Autorización completa',
                row.nivel,
                session.api_token,
              )
              if (finalizado == 'OK') {
                pagos.push(row.id_flujo)
                sessionStorage.removeItem(valorPago)
              }
            }
          }
        }
      })
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

  async function AccionModalRecordar(opcion) {
    setDesactivarBotonModal(true)
    if (opcion == 1) {
      if (PuedeEnviarRecordatorio) {
        var markedCheckbox = document.getElementsByName('autorizarPago')
        for (var checkbox of markedCheckbox) {
          if (checkbox.checked) {
            let valorPago = checkbox.value
            let partes = checkbox.value.split('|')
            await postRecordatorioUsuario('', '', '', session.id, partes[0], session.api_token)
            sessionStorage.removeItem(valorPago)
            checkbox.checked = false
          }
        }
      } else {
        setShow(true)
        setTitulo('Error!')
        setColor('danger')
        setMensaje(
          'No tiene configurados usuarios para enviar recordatorio, comuniquese con el administrador.',
        )
      }
      setShowModalRecordar(false)
      setActualizarTabla(actualizarTabla + 1)
    } else if (opcion == 2) {
      setShowModalRecordar(false)
    }
    setDesactivarBotonModal(false)
  }

  async function AccionModalConDuda(opcion) {
    setDesactivarBotonModal(true)
    if (opcion == 1) {
      var markedCheckbox = document.getElementsByName('autorizarPago')
      for (var checkbox of markedCheckbox) {
        if (checkbox.checked) {
          let valorPago = checkbox.value
          let partes = checkbox.value.split('|')
          await postFlujos(partes[0], '0', '', '8', null, session.id, session.api_token)
          sessionStorage.removeItem(valorPago)
          checkbox.checked = false
        }
      }
      setShowModalConDuda(false)
      setActualizarTabla(actualizarTabla + 1)
    } else if (opcion == 2) {
      setShowModalConDuda(false)
    }
    setDesactivarBotonModal(false)
  }

  function MostrarPorFiltro(color) {
    if (color == 'NO') {
      setListdata(dataOriginal)

      let datosOrdenados = []
      dataOriginal.forEach((item) => {
        datosOrdenados.push({
          id_flujo: item.id_flujo,
          estado: item.estado,
          nivel: item.nivel,
          id_grupo: item.id_grupoautorizacion,
          PuedoAutorizar: item.PuedoAutorizar,
          pago: item.doc_num,
          seccion: 'Pendientes',
        })
      })
      sessionStorage.setItem('listaPagos', JSON.stringify(datosOrdenados))
      setActualizarColor(!actualizarColor)
    } else {
      setListdata(
        dataOriginal.filter(function (pago) {
          return pago.colorSemaforo == color
        }),
      )

      let datosOrdenados = []
      dataOriginal.forEach((item) => {
        if (item.colorSemaforo == color) {
          datosOrdenados.push({
            id_flujo: item.id_flujo,
            estado: item.estado,
            nivel: item.nivel,
            id_grupo: item.id_grupoautorizacion,
            PuedoAutorizar: item.PuedoAutorizar,
            pago: item.doc_num,
            seccion: 'Pendientes',
          })
        }
      })
      sessionStorage.setItem('listaPagos', JSON.stringify(datosOrdenados))
      setActualizarColor(!actualizarColor)
    }
  }

  useEffect(() => {
    Ordenamiento(columnaOrden, direccionOrden, null)
  }, [actualizarColor])

  const conditionalRowStyles = [
    {
      when: (row) => row.marcarRecordado > 0,
      style: {
        backgroundColor: '#fffadd',
      },
    },
  ]

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
            <Button
              disabled={desactivarBotonModal}
              variant="primary"
              onClick={() => AccionModalCargarNuevos(1)}
            >
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
            <Button
              disabled={desactivarBotonModal}
              variant="primary"
              onClick={() => AccionModalAutorizar(1)}
            >
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal responsive variant="primary" show={showModalRecordar} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ¿Está seguro de notificar recordatorio de los pagos seleccionados?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => AccionModalRecordar(2)}>
              Cancelar
            </Button>
            <Button
              disabled={desactivarBotonModal}
              variant="primary"
              onClick={() => AccionModalRecordar(1)}
            >
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal responsive variant="primary" show={showModalConDuda} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación</Modal.Title>
          </Modal.Header>
          <Modal.Body>¿Está seguro de marcar con duda los pagos seleccionados?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => AccionModalConDuda(2)}>
              Cancelar
            </Button>
            <Button
              disabled={desactivarBotonModal}
              variant="primary"
              onClick={() => AccionModalConDuda(1)}
            >
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
        <Alert show={show} variant={color} onClose={() => setShow(false)} dismissible>
          <Alert.Heading>{titulo}</Alert.Heading>
          <p>{mensaje}</p>
        </Alert>
        <div style={{ display: 'flex' }}>
          <div
            style={{
              width: '40%',
              display: 'flex',
              gap: '10px',
              justifyContent: 'flex-start',
              paddingLeft: '10px',
            }}
          >
            <OverlayTrigger
              placement="top"
              delay={{ show: 250, hide: 150 }}
              overlay={<Tooltip>Mostrar todos</Tooltip>}
            >
              <Button variant="outline-secondary" onClick={() => MostrarPorFiltro('NO')}>
                <FaCircle />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              delay={{ show: 250, hide: 150 }}
              overlay={<Tooltip>Mostrar pendientes</Tooltip>}
            >
              <Button variant="outline-success" onClick={() => MostrarPorFiltro('VERDE')}>
                <FaCircle />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              delay={{ show: 250, hide: 150 }}
              overlay={<Tooltip>Mostrar importantes</Tooltip>}
            >
              <Button variant="outline-warning" onClick={() => MostrarPorFiltro('AMARILLO')}>
                <FaCircle />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              delay={{ show: 250, hide: 150 }}
              overlay={<Tooltip>Mostrar urgentes</Tooltip>}
            >
              <Button variant="outline-danger" onClick={() => MostrarPorFiltro('ROJO')}>
                <FaCircle />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              delay={{ show: 250, hide: 150 }}
              overlay={<Tooltip>Mostrar urgentes con duda</Tooltip>}
            >
              <Button variant="outline-primary" onClick={() => MostrarPorFiltro('AZUL')}>
                <FaCircle />
              </Button>
            </OverlayTrigger>
          </div>
          <div style={{ width: '60%', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
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
            {'  '}
            <CButton
              className={!PuedeEnviarRecordatorio ? 'd-none float-right' : 'float-right'}
              color="secondary"
              size="sm"
              onClick={() => mostrarModalRecordar()}
            >
              Enviar recordatorio pagos seleccionados
            </CButton>
            {'  '}
            <CButton
              /* className={!showAutorizar ? 'd-none float-right' : 'float-right'} */
              className="float-right"
              color="info"
              size="sm"
              onClick={() => mostrarModalConDuda()}
            >
              Marcar pago(s) con duda
            </CButton>
            <br />
            <br />
          </div>
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
            conditionalRowStyles={conditionalRowStyles}
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

export default Pendientes
