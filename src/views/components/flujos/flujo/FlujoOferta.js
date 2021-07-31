import React, { useState, useEffect } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import { useSession } from 'react-use-session'
import { useHistory } from 'react-router-dom'
import { getFlujoOferta } from '../../../../services/getFlujoOferta'
import '../../../../scss/estilos.scss'

const FlujoTabs = (prop) => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])

  useEffect(() => {
    let mounted = true
    getFlujoOferta(prop.id_flujo, null).then((items) => {
      if (mounted) {
        setList(items.oferta[0])
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
          </Container>
          <br />
        </div>
      )
    } else {
      return <div className="sin-array">AÚN NO EXISTE OFERTA DE COMPRA.</div>
    }
  } else {
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default FlujoTabs
