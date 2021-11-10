import React from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import { useSession } from 'react-use-session'
import { useHistory } from 'react-router-dom'
import '../../../../scss/estilos.scss'

const FlujoOferta = (prop) => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')

  if (session) {
    if (prop.results) {
      return (
        <div>
          <Container className="mb-0 border">
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Número Documento</Col>
              <Col className="mb-0 border">{prop.results.doc_num}</Col>
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
              <Col className="mb-0 border column">Código Item</Col>
              <Col className="mb-0 border">{prop.results.item_code}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Descripción</Col>
              <Col className="mb-0 border">{prop.results.description}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Código UOM</Col>
              <Col className="mb-0 border">{prop.results.uom_code}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Precio</Col>
              <Col className="mb-0 border">{prop.results.price}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Cantidad</Col>
              <Col className="mb-0 border">{prop.results.quantity}</Col>
            </Row>
          </Container>
          <br />
        </div>
      )
    } else {
      return <div className="sin-array">AÚN NO EXISTE OFERTA DE COMPRA.</div>
    }
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default FlujoOferta
