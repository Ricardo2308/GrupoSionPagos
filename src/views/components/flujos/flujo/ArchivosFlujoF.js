import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { PDFReader } from 'reactjs-pdf-view'
import { useSession } from 'react-use-session'
import { useHistory } from 'react-router-dom'
import { FaRegFilePdf } from 'react-icons/fa'
import '../../../../scss/estilos.scss'
import {
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { Row, Col, Container, Modal, Tab, Tabs, Button } from 'react-bootstrap'

const ArchivosFlujo = (prop) => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [mostrar, setMostrar] = useState(false)
  const [urlArchivo, setUrlArchivo] = useState('')
  const [titulo, setTitulo] = useState('')
  const cerrarPDF = () => setMostrar(false)

  const modalBody = () => {
    if (prop.empresa === undefined) {
      return (
        <div
          style={{
            background: 'rgba(0,0,0,0.7)',
            left: 0,
            position: 'fixed',
            top: 0,
            height: '100%',
            width: '100%',
            zIndex: 10001,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'scroll',
          }}
        >
          <div className="float-right" style={{ margin: '10px', textAlign: 'right' }}>
            <Button variant="danger" size="sm" onClick={() => setMostrar(false)}>
              Cerrar
            </Button>
          </div>
          <object data={urlArchivo} type="application/pdf" width="100%" height="100%">
            <p>
              Alternative text - include a link <a href={urlArchivo}>to the PDF!</a>
            </p>
          </object>
        </div>
      )
    } else {
      return (
        <div
          style={{
            background: 'rgba(0,0,0,0.7)',
            left: 0,
            position: 'fixed',
            top: 0,
            height: '100%',
            width: '100%',
            zIndex: 10001,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className="float-right" style={{ margin: '10px', textAlign: 'right' }}>
            <Button variant="danger" size="sm" onClick={() => setMostrar(false)}>
              Cerrar
            </Button>
          </div>
          <div style={{ display: 'flex', height: '100%', width: '100%', backgroundColor: '#fff' }}>
            <div style={{ width: '30%', padding: '10px' }}>
              <h2>Encabezado</h2>
              <br />
              <Container className="mb-0">
                <Row className="mb-0">
                  <Col className="mb-0 border column">Empresa</Col>
                  <Col className="mb-0 border">{prop.empresa}</Col>
                </Row>
                <Row className="mb-0">
                  <Col className="mb-0 border column">Número Documento</Col>
                  <Col className="mb-0 border">{prop.docNum}</Col>
                </Row>
                <Row className="mb-0">
                  <Col className="mb-0 border column">Beneficiario</Col>
                  <Col className="mb-0 border">{prop.beneficiario}</Col>
                </Row>
                <Row className="mb-0">
                  <Col className="mb-0 border column">Concepto</Col>
                  <Col className="mb-0 border">{prop.concepto}</Col>
                </Row>
                <Row className="mb-0">
                  <Col className="mb-0 border column">Monto</Col>
                  <Col className="mb-0 border">{prop.monto}</Col>
                </Row>
              </Container>
            </div>
            <div style={{ height: '100%', width: '70%' }}>
              <object data={urlArchivo} type="application/pdf" width="100%" height="100%">
                <p>
                  Alternative text - include a link <a href={urlArchivo}>to the PDF!</a>
                </p>
              </object>
            </div>
          </div>
        </div>
      )
    }
  }

  function mostrarModal(id_archivoflujo, url_archivo, usuario) {
    if (id_archivoflujo === '' && url_archivo !== '' && usuario !== '') {
      setUrlArchivo(url_archivo)
      setTitulo('Cargado por ' + usuario)
      setMostrar(true)
    }
  }

  if (session) {
    return (
      <>
        {mostrar && ReactDOM.createPortal(modalBody(), document.body)}
        <CTable hover responsive align="middle" className="mb-0 border">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell className="text-center">#</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Usuario</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Descripcion Archvo</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Estado</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {prop.results.map((item, i) => {
              let estado = 'Inactivo'
              if (item.eliminado == 0) {
                if (item.activo == 1) {
                  estado = 'Activo'
                }
                if (prop.estado < 2) {
                  return (
                    <CTableRow key={item.id_archivoflujo}>
                      <CTableDataCell className="text-center">{i + 1}</CTableDataCell>
                      <CTableDataCell className="text-center">{item.nombre_usuario}</CTableDataCell>
                      <CTableDataCell className="text-center">{item.descripcion}</CTableDataCell>
                      <CTableDataCell className="text-center">{estado}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton
                          color="danger"
                          variant="outline"
                          size="sm"
                          target="_blank"
                          title="Ver PDF"
                          onClick={() => mostrarModal('', item.archivo, item.nombre_usuario)}
                        >
                          <FaRegFilePdf />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  )
                } else {
                  return (
                    <CTableRow key={item.id_archivoflujo}>
                      <CTableDataCell className="text-center">{i + 1}</CTableDataCell>
                      <CTableDataCell className="text-center">{item.nombre_usuario}</CTableDataCell>
                      <CTableDataCell className="text-center">{item.descripcion}</CTableDataCell>
                      <CTableDataCell className="text-center">{estado}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton
                          color="danger"
                          variant="outline"
                          size="sm"
                          target="_blank"
                          title="Ver PDF"
                          onClick={() => mostrarModal('', item.archivo, item.nombre_usuario)}
                        >
                          <FaRegFilePdf />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  )
                }
              }
            })}
          </CTableBody>
        </CTable>
      </>
    )
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default ArchivosFlujo
