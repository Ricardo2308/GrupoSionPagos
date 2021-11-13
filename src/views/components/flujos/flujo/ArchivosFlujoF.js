import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
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

const ArchivosFlujo = (prop) => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [mostrar, setMostrar] = useState(false)
  const [urlArchivo, setUrlArchivo] = useState('')
  const [titulo, setTitulo] = useState('')
  const cerrarPDF = () => setMostrar(false)

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
        <Modal show={mostrar} onHide={cerrarPDF} centered dialogClassName="my-modal">
          <Modal.Header className="modal-bg" closeButton>
            <Modal.Title>{titulo}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ overflow: 'scroll', height: 430 }}>
              <PDFReader url={urlArchivo} showAllPage={true} getPageNumber={1} />
            </div>
          </Modal.Body>
          <Modal.Footer className="modal-bg">
            <CButton color="success">
              <a style={{ textDecoration: 'none', color: 'white' }} href={urlArchivo} download>
                Descargar
              </a>
            </CButton>
          </Modal.Footer>
        </Modal>
        <CTable hover responsive align="middle" className="mb-0 border">
          <CTableHead color="light">
            <CTableRow>
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
                        </CButton>{' '}
                        {/*
                        <CButton
                          color="danger"
                          size="sm"
                          title="Eliminar PDF"
                          disabled={prop.deshabilitar}
                          onClick={() => mostrarModal(item.id_archivoflujo, '', '')}
                        >
                          <FaTrash />
                        </CButton>
                        */}
                      </CTableDataCell>
                    </CTableRow>
                  )
                } else {
                  return (
                    <CTableRow key={item.id_archivoflujo}>
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
