import React from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import { useSession } from 'react-use-session'
import { useHistory } from 'react-router-dom'
import '../../../../scss/estilos.scss'

const FlujoIngreso = (prop) => {
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
              <Col className="mb-0 border column">Fecha Impuesto</Col>
              <Col className="mb-0 border">{prop.results.tax_date}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Fecha Documento</Col>
              <Col className="mb-0 border">{prop.results.doc_date}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Nombre WHS</Col>
              <Col className="mb-0 border">{prop.results.whs_name}</Col>
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
              <Col className="mb-0 border column">Código UOM</Col>
              <Col className="mb-0 border">{prop.results.uom_code}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Cantidad</Col>
              <Col className="mb-0 border">{prop.results.quantity}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Descripción</Col>
              <Col className="mb-0 border">{prop.results.dscription}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Comentarios</Col>
              <Col className="mb-0 border">{prop.results.comments}</Col>
            </Row>
          </Container>
          <br />
        </div>
      )
    } else {
      return <div className="sin-array">AÚN NO EXISTE UN INGRESO A BODEGA.</div>
    }
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default FlujoIngreso
