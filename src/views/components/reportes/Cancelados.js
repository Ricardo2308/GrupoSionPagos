/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useIdleTimer } from 'react-idle-timer'
import { useSession } from 'react-use-session'
import { Button, Modal } from 'react-bootstrap'
import { getReporteCancelados } from '../../../services/getReporteCancelados'
import { postSesionUsuario } from '../../../services/postSesionUsuario'
import spanish from '../../../lenguaje/es.json'
import '../../../scss/estilos.scss'

const Cancelados = (prop) => {
  const history = useHistory()
  const [time, setTime] = useState(null)
  const [show, setShow] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const { session, clear } = useSession('PendrogonIT-Session')
  const handleClose = () => setShow(false)

  useEffect(() => {
    let mounted = true
    let pagos = []
    getReporteCancelados(session.api_token).then((items) => {
      if (mounted) {
        pagos.push(items.flujos)
        var pivot = new WebDataRocks({
          container: '#wdr-component',
          beforetoolbarcreated: customizeToolbar,
          height: 480,
          toolbar: true,
          report: {
            dataSource: {
              data: items.flujos,
            },
            slice: {
              rows: [
                {
                  uniqueName: 'empresa_nombre',
                  caption: 'Empresa',
                },
                {
                  uniqueName: 'doc_num',
                  caption: 'Documento',
                },
                {
                  uniqueName: 'cuenta_orgien',
                  caption: 'Cuenta',
                },
                {
                  uniqueName: 'en_favor_de',
                  caption: 'Beneficiario',
                },
                {
                  uniqueName: 'comments',
                  caption: 'Concepto',
                },
                {
                  uniqueName: 'doc_total',
                  caption: 'Monto',
                },
                {
                  uniqueName: 'doc_date',
                  caption: 'Emisión',
                },
                {
                  uniqueName: 'fecha',
                  caption: 'Fecha',
                },
              ],
            },
            conditions: [
              {
                formula: `#value <= ${session.verde}`,
                measure: 'porcentaje',
                format: {
                  backgroundColor: '#60FB7A',
                  color: '#60FB7A',
                  fontFamily: 'Arial',
                  fontSize: '12px',
                },
              },
              {
                formula: `AND(#value > ${session.verde}, #value <= ${session.amarillo})`,
                measure: 'porcentaje',
                format: {
                  backgroundColor: '#DACF3B',
                  color: '#DACF3B',
                  fontFamily: 'Arial',
                  fontSize: '12px',
                },
              },
              {
                formula: `#value > ${session.amarillo}`,
                measure: 'porcentaje',
                format: {
                  backgroundColor: '#FC756C',
                  color: '#FC756C',
                  fontFamily: 'Arial',
                  fontSize: '12px',
                },
              },
            ],
            options: {
              grid: {
                type: 'flat',
                showTotals: 'off',
                showGrandTotals: 'off',
              },
              showEmptyData: false,
            },
            formats: [
              {
                name: '4ktymhkg',
                thousandsSeparator: ' ',
                decimalSeparator: '.',
                currencySymbol: '',
                currencySymbolAlign: 'left',
                nullValue: '',
                textAlign: 'center',
                isPercent: true,
              },
            ],
          },
          global: {
            localization: spanish,
          },
        })
      }
    })
    return () => (mounted = false)
  }, [])

  function customizeToolbar(toolbar) {
    var tabs = toolbar.getTabs()
    toolbar.getTabs = function () {
      delete tabs[0]
      delete tabs[1]
      return tabs
    }
  }

  async function Salir() {
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

  if (session) {
    return (
      <>
        <Modal responsive variant="primary" show={show} onHide={() => Salir()} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación</Modal.Title>
          </Modal.Header>
          <Modal.Body>{mensaje}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => Salir()}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
        <div id="wdr-component"></div>
      </>
    )
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default Cancelados
