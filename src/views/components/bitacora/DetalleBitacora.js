import React, { useState, useEffect, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { getSoporteBitacora } from '../../../services/getSoporteBitacora'
import { getPerfilUsuario } from '../../../services/getPerfilUsuario'
import { useSession } from 'react-use-session'
import { FaList, FaArrowLeft } from 'react-icons/fa'
import '../../../scss/estilos.scss'
import { CButton } from '@coreui/react'
import DataTable, { defaultThemes } from 'react-data-table-component'
import DataTableExtensions from 'react-data-table-component-extensions'
import 'react-data-table-component-extensions/dist/index.css'
import { Button, Row, Col, Container, Modal } from 'react-bootstrap'

const Bitacora = () => {
  const history = useHistory()
  const location = useLocation()
  const { session, clear } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [permisos, setPermisos] = useState([])

  useEffect(() => {
    let mounted = true
    let objeto = 'Modulo Bitacora'
    let idUsuario = 0
    if (session) {
      idUsuario = session.id
    }
    getSoporteBitacora(null, null, location.id_bitacora, session.api_token).then((items) => {
      if (mounted) {
        setList(items.bitacora[0])
      }
    })
    getPerfilUsuario(idUsuario, '2', objeto, session.api_token).then((items) => {
      if (mounted) {
        setPermisos(items.detalle)
      }
    })
    return () => (mounted = false)
  }, [])

  if (session) {
    return (
      <>
        <div className="float-left" style={{ marginBottom: '10px' }}>
          <Button variant="primary" size="sm" onClick={() => history.goBack()}>
            <FaArrowLeft />
            &nbsp;&nbsp;Regresar
          </Button>
        </div>
        <br />
        <br />
        <div className="div-tabs">
          <div>
            <Container className="mb-0 border">
              <Row className="mb-0 border">
                <Col className="mb-0 border column">Usuario</Col>
                <Col className="mb-0 border">{results.nombre_usuario}</Col>
              </Row>
              <Row className="mb-0 border">
                <Col className="mb-0 border column">Nombre</Col>
                <Col className="mb-0 border">{results.nombre + ' ' + results.apellido}</Col>
              </Row>
              <Row className="mb-0 border">
                <Col className="mb-0 border column">Fecha</Col>
                <Col className="mb-0 border">{results.fecha_hora}</Col>
              </Row>
              <Row className="mb-0 border">
                <Col className="mb-0 border column">Acción</Col>
                <Col className="mb-0 border">{results.accion}</Col>
              </Row>
              <Row className="mb-0 border">
                <Col className="mb-0 border column">Objeto</Col>
                <Col className="mb-0 border">{results.objeto}</Col>
              </Row>
              <Row className="mb-0 border">
                <Col className="mb-0 border column">Datos anteriores</Col>
                <Col className="mb-0 border">
                  <code>{results.parametros_anteriores}</code>
                </Col>
              </Row>
              <Row className="mb-0 border">
                <Col className="mb-0 border column">Datos nuevos</Col>
                <Col className="mb-0 border">
                  <code>{results.parametros_nuevos}</code>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </>
    )
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default Bitacora
