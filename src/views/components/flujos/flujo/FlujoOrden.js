import React, { useState, useEffect } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import { useSession } from 'react-use-session'
import { useHistory } from 'react-router-dom'
import { useIdleTimer } from 'react-idle-timer'
import { getFlujoOrden } from '../../../../services/getFlujoOrden'
import '../../../../scss/estilos.scss'

const FlujoOrden = (prop) => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [show, setShow] = useState(false)
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    let mounted = true
    getFlujoOrden(prop.id_flujo, null).then((items) => {
      if (mounted) {
        setList(items.orden[0])
      }
    })
    return () => (mounted = false)
  }, [])

  const handleOnIdle = (event) => {
    setShow(true)
    setOpcion(2)
    setMensaje(
      'Ya estuvo mucho tiempo sin realizar ninguna acción. Si desea continuar presione aceptar.',
    )
    console.log('last active', getLastActiveTime())
  }

  const handleOnActive = (event) => {
    console.log('time remaining', getRemainingTime())
  }

  const handleOnAction = (event) => {}

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * parseInt(session == null ? 1 : session.limiteconexion),
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500,
  })

  if (session) {
    if (results) {
      return (
        <div>
          <Container className="mb-0 border">
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Número Documento</Col>
              <Col className="mb-0 border">{results.docu_num}</Col>
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
              <Col className="mb-0 border column">Nit Factura</Col>
              <Col className="mb-0 border">{results.fac_nit}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Teléfono</Col>
              <Col className="mb-0 border">{results.phone1}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Término Pago</Col>
              <Col className="mb-0 border">{results.termino_pago}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Dirección</Col>
              <Col className="mb-0 border">{results.address}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Usuario</Col>
              <Col className="mb-0 border">{results.user}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Código Item</Col>
              <Col className="mb-0 border">{results.item_code}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Precio</Col>
              <Col className="mb-0 border">{results.price}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Cantidad</Col>
              <Col className="mb-0 border">{results.quantity}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Línea Total</Col>
              <Col className="mb-0 border">{results.line_total}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Total Documento</Col>
              <Col className="mb-0 border">{results.doc_total}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Comentario</Col>
              <Col className="mb-0 border">{results.comment}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Crear Usuario</Col>
              <Col className="mb-0 border">{results.crea_usuario}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Crear Fecha</Col>
              <Col className="mb-0 border">{results.crea_fecha}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Autorización Usuario</Col>
              <Col className="mb-0 border">{results.autoriza_usuario}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Autorización Fecha</Col>
              <Col className="mb-0 border">{results.autoriza_fecha}</Col>
            </Row>
          </Container>
          <br />
        </div>
      )
    } else {
      return <div className="sin-array">AÚN NO EXISTE ORDEN DE COMPRA.</div>
    }
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default FlujoOrden
