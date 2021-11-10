import React from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import { useSession } from 'react-use-session'
import { useHistory } from 'react-router-dom'
import '../../../../scss/estilos.scss'

const FlujoSolicitud = (prop) => {
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
              <Col className="mb-0 border column">Nombre</Col>
              <Col className="mb-0 border">{prop.results.req_name}</Col>
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
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Unidades Totales</Col>
              <Col className="mb-0 border">{prop.results.unidades_totales}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Unidades por Caja</Col>
              <Col className="mb-0 border">{prop.results.unidades_por_caja}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Comentarios</Col>
              <Col className="mb-0 border">{prop.results.comments}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Autorizador 1</Col>
              <Col className="mb-0 border">{prop.results.autorizador1}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Autorizador 2</Col>
              <Col className="mb-0 border">{prop.results.autorizador2}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Autorizador 3</Col>
              <Col className="mb-0 border">{prop.results.autorizador3}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Fecha Autorización 1</Col>
              <Col className="mb-0 border">{prop.results.fecha_aut1}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Fecha Autorización 2</Col>
              <Col className="mb-0 border">{prop.results.fecha_aut2}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Fecha Autorización 3</Col>
              <Col className="mb-0 border">{prop.results.fecha_aut3}</Col>
            </Row>
          </Container>
          <br />
        </div>
      )
    } else {
      return <div className="sin-array">AÚN NO EXISTE SOLICITUD.</div>
    }
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default FlujoSolicitud
