import React from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import { useSession } from 'react-use-session'
import { useHistory } from 'react-router-dom'
import '../../../../scss/estilos.scss'

const FlujoOrden = (prop) => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')

  if (session) {
    if (prop.results) {
      return (
        <div>
          <Container className="mb-0 border">
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Número Documento</Col>
              <Col className="mb-0 border">{prop.results.docu_num}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Fecha Impuesto</Col>
              <Col className="mb-0 border">{prop.results.tax_date}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Fecha Documento</Col>
              <Col className="mb-0 border">{prop.results.doc_date}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Código Tarjeta</Col>
              <Col className="mb-0 border">{prop.results.card_code}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Nombre Tarjeta</Col>
              <Col className="mb-0 border">{prop.results.card_name}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Nit Factura</Col>
              <Col className="mb-0 border">{prop.results.fac_nit}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Teléfono</Col>
              <Col className="mb-0 border">{prop.results.phone1}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Término Pago</Col>
              <Col className="mb-0 border">{prop.results.termino_pago}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Dirección</Col>
              <Col className="mb-0 border">{prop.results.address}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Usuario</Col>
              <Col className="mb-0 border">{prop.results.user}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Código Item</Col>
              <Col className="mb-0 border">{prop.results.item_code}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Precio</Col>
              <Col className="mb-0 border">{prop.results.price}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Cantidad</Col>
              <Col className="mb-0 border">{prop.results.quantity}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Línea Total</Col>
              <Col className="mb-0 border">{prop.results.line_total}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Total Documento</Col>
              <Col className="mb-0 border">{prop.results.doc_total}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Comentario</Col>
              <Col className="mb-0 border">{prop.results.comment}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Crear Usuario</Col>
              <Col className="mb-0 border">{prop.results.crea_usuario}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Crear Fecha</Col>
              <Col className="mb-0 border">{prop.results.crea_fecha}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Autorización Usuario</Col>
              <Col className="mb-0 border">{prop.results.autoriza_usuario}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Autorización Fecha</Col>
              <Col className="mb-0 border">{prop.results.autoriza_fecha}</Col>
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
