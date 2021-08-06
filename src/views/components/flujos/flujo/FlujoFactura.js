import React, { useState, useEffect } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import { useSession } from 'react-use-session'
import { useHistory } from 'react-router-dom'
import { getFlujoSolicitud } from '../../../../services/getFlujoSolicitud'
import '../../../../scss/estilos.scss'

const FlujoFactura = (prop) => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])

  useEffect(() => {
    let mounted = true
    getFlujoSolicitud(prop.id_flujo, null).then((items) => {
      if (mounted) {
        setList(items.solicitud[0])
      }
    })
    return () => (mounted = false)
  }, [])

  if (session) {
    if (results) {
      return (
        <div>
          <Container className="mb-0 border">
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Número Documento</Col>
              <Col className="mb-0 border">{results.doc_num}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Nombre Request</Col>
              <Col className="mb-0 border">{results.req_name}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Código Item</Col>
              <Col className="mb-0 border">{results.item_code}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Descripción</Col>
              <Col className="mb-0 border">{results.description}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Código UOM</Col>
              <Col className="mb-0 border">{results.uom_code}</Col>
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
              <Col className="mb-0 border column">Unidades Totales</Col>
              <Col className="mb-0 border">{results.unidades_totales}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Unidades por Caja</Col>
              <Col className="mb-0 border">{results.unidades_por_caja}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Comentarios</Col>
              <Col className="mb-0 border">{results.comments}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Autorizador 1</Col>
              <Col className="mb-0 border">{results.autorizador1}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Autorizador 2</Col>
              <Col className="mb-0 border">{results.autorizador2}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Autorizador 3</Col>
              <Col className="mb-0 border">{results.autorizador3}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Fecha Autorización 1</Col>
              <Col className="mb-0 border">{results.fecha_aut1}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Fecha Autorización 2</Col>
              <Col className="mb-0 border">{results.fecha_aut2}</Col>
            </Row>
            <Row className="mb-0 border">
              <Col className="mb-0 border column">Fecha Autorización 3</Col>
              <Col className="mb-0 border">{results.fecha_aut3}</Col>
            </Row>
          </Container>
          <br />
        </div>
      )
    } else {
      return <div className="sin-array">AÚN NO EXISTE FACTURA.</div>
    }
  } else {
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default FlujoFactura
