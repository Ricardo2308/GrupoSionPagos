import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { PDFReader } from 'reactjs-pdf-view'
import { getArchivosFlujo } from '../../../../services/getArchivosFlujo'
import { postArchivoFlujo } from '../../../../services/postArchivoFlujo'
import { useSession } from 'react-use-session'
import { useHistory } from 'react-router-dom'
import { FaTrash, FaRegFilePdf } from 'react-icons/fa'
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

const ArchivosFlujo = () => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [show, setShow] = useState(false)
  const [mostrar, setMostrar] = useState(false)
  const [idArchivoFlujo, setIdArchivoFlujo] = useState(0)
  const [urlArchivo, setUrlArchivo] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [titulo, setTitulo] = useState('')

  const handleClose = () => setShow(false)
  const cerrarPDF = () => setMostrar(false)

  useEffect(() => {
    let mounted = true
    getArchivosFlujo(null, session.id).then((items) => {
      if (mounted) {
        setList(items.archivos)
        console.log(items)
      }
    })
    return () => (mounted = false)
  }, [])

  function mostrarModal(id_archivoflujo, url_archivo, usuario) {
    if (id_archivoflujo !== '' && url_archivo === '' && usuario === '') {
      setIdArchivoFlujo(id_archivoflujo)
      setMensaje('Está seguro de eliminar este documento de pago?')
      setTitulo('Confirmación')
      setShow(true)
    } else if (id_archivoflujo === '' && url_archivo !== '' && usuario !== '') {
      setUrlArchivo(url_archivo)
      setTitulo('Cargado por ' + usuario)
      setMostrar(true)
    }
  }

  async function eliminarArchivoFlujo(id_archivoflujo) {
    const respuesta = await postArchivoFlujo(id_archivoflujo, '', '', '', '', '', '2', '')
    if (respuesta === 'OK') {
      await getArchivosFlujo(null, session.id).then((items) => {
        setList(items.archivos)
      })
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
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{titulo}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{mensaje}</Modal.Body>
          <Modal.Footer>
            <CButton color="secondary" onClick={handleClose}>
              Cancelar
            </CButton>
            <CButton
              color="primary"
              onClick={() => eliminarArchivoFlujo(idArchivoFlujo).then(handleClose)}
            >
              Aceptar
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
            {results.map((item, i) => {
              let estado = 'Inactivo'
              if (item.estado_eliminado !== '1') {
                if (item.estado_activo === '1') {
                  estado = 'Activo'
                }
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
                        onClick={() => mostrarModal('', item.archivo, session.user_name)}
                      >
                        <FaRegFilePdf />
                      </CButton>{' '}
                      {/*
                      <CButton
                        color="primary"
                        size="sm"
                        onClick={() =>
                          history.push({
                            pathname: '/archivoflujo/editar',
                            id_archivoflujo: item.id_archivoflujo,
                            id_flujo: item.id_flujo,
                            id_usuario: item.id_usuario,
                            nombre_usuario: item.nombre_usuario,
                            descripcion: item.descripcion,
                            url_archivo: item.archivo,
                            estado: item.estado_activo,
                            opcion: '0',
                          })
                        }
                      >
                        <FaPen />
                      </CButton>
                      */}{' '}
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => mostrarModal(item.id_archivoflujo, '', '')}
                      >
                        <FaTrash />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                )
              }
            })}
          </CTableBody>
        </CTable>
      </>
    )
  } else {
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default ArchivosFlujo