import React, { useState, useEffect } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import { useSession } from 'react-use-session'
import { useHistory } from 'react-router-dom'
import { useIdleTimer } from 'react-idle-timer'
import { getFlujoSolicitud } from '../../../../services/getFlujoSolicitud'
import '../../../../scss/estilos.scss'

const FlujoIngreso = (prop) => {
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
              <Col className="mb-0 border column">Tipo</Col>
              <Col className="mb-0 border">{results.tipo}</Col>
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
              <Col className="mb-0 border column">Cuenta DFL</Col>
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
      return <div className="sin-array">AÚN NO EXISTE UN INGRESO A BODEGA.</div>
    }
  } else {
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default FlujoIngreso
