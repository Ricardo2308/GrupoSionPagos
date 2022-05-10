import React, { useState, useEffect } from 'react'
import { Row, Col, Container, Modal } from 'react-bootstrap'
import { useSession } from 'react-use-session'
import { useHistory } from 'react-router-dom'
import { useIdleTimer } from 'react-idle-timer'
import { getDetalle } from '../../../../services/getDetalle'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import '../../../../scss/estilos.scss'

const DetalleFlujo = (prop) => {
  const history = useHistory()
  const { session, clear } = useSession('PendrogonIT-Session')
  const [show, setShow] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [results, setList] = useState([])

  useEffect(() => {
    let mounted = true
    getDetalle(prop.id_flujo, session.api_token).then((items) => {
      if (mounted) {
        setList(items.flujos[0])
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
      const respuesta = await postSesionUsuario(idUsuario, null, null, '2', session.api_token)
      if (respuesta === 'OK') {
        clear()
        history.push('/')
      }
    }
  }

  const handleOnIdle = (event) => {
    setShow(true)
    setMensaje(
      'Ya estuvo mucho tiempo sin realizar ninguna acción. Si desea continuar presione aceptar.',
    )
    console.log('last active', getLastActiveTime())
  }

  const handleOnActive = (event) => {
    console.log('time remaining', getRemainingTime())
  }

  const handleOnAction = (event) => {
    return false
  }

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * parseInt(session == null ? 1 : session.limiteconexion),
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500,
  })

  if (session) {
    if (results) {
      let grupo = 'Pendiente'
      if (results.grupoautorizacion) {
        grupo = results.grupoautorizacion
      }
      return (
        <div>
          <Container className="mb-0 border">
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Número Documento</Col>
              <Col className="mb-0 border">{results.doc_num}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Tipo</Col>
              <Col className="mb-0 border">{results.tipo}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Grupo Autorización</Col>
              <Col className="mb-0 border">{grupo}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Días Crédito</Col>
              <Col className="mb-0 border">{results.dias_credito}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Condición Pago</Col>
              <Col className="mb-0 border">{results.condicion_pago}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Fecha Impuesto</Col>
              <Col className="mb-0 border">{results.tax_date}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Fecha Documento</Col>
              <Col className="mb-0 border">{results.doc_date}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Código Tarjeta</Col>
              <Col className="mb-0 border">{results.card_code}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Nombre Tarjeta</Col>
              <Col className="mb-0 border">{results.card_name}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Comentarios</Col>
              <Col className="mb-0 border">{results.comments}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Total Documento</Col>
              <Col className="mb-0 border">{results.doc_total}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Divisa</Col>
              <Col className="mb-0 border">{results.doc_curr}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Código Banco</Col>
              <Col className="mb-0 border">{results.bank_code}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Cuenta Bancaria</Col>
              <Col className="mb-0 border">{results.dfl_account}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Tipo Cuenta Destino</Col>
              <Col className="mb-0 border">{results.tipo_cuenta_destino}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Cuenta Origen</Col>
              <Col className="mb-0 border">{results.cuenta_orgien}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Código Empresa</Col>
              <Col className="mb-0 border">{results.empresa_codigo}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Nombre Empresa</Col>
              <Col className="mb-0 border">{results.empresa_nombre}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Cheque</Col>
              <Col className="mb-0 border">{results.cheque}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">En Favor De</Col>
              <Col className="mb-0 border">{results.en_favor_de}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Correo Electrónico</Col>
              <Col className="mb-0 border">{results.email}</Col>
            </Row>
          </Container>
          <br />
        </div>
      )
    } else {
      return <div className="sin-array">AÚN NO EXISTE DETALLE DE PAGO.</div>
    }
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default DetalleFlujo
