import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { postCondicionGrupo } from '../../../../services/postCondicionGrupo'
import { getCondicionGrupo } from '../../../../services/getCondicionGrupo'
import { useSession } from 'react-use-session'
import { Modal } from 'react-bootstrap'
import {
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { FaTrash, FaPen } from 'react-icons/fa'
import { BsToggles } from 'react-icons/bs'
import '../../../../scss/estilos.scss'

const ConsultarPR = () => {
  const history = useHistory()
  const location = useLocation()
  const { session } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [show, setShow] = useState(false)
  const [idGrupo, setIdGrupo] = useState(0)
  const [estado, setEstado] = useState(0)
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')

  const handleClose = () => setShow(false)

  useEffect(() => {
    let mounted = true
    getCondicionGrupo(location.id_condicion, null).then((items) => {
      if (mounted) {
        setList(items.detalle)
      }
    })
    return () => (mounted = false)
  }, [])

  function mostrarModal(id_grupo, opcion, estado) {
    if (opcion === '2') {
      setMensaje('Está seguro de eliminar este detalle de grupos asociados a la condición?')
      setIdGrupo(id_grupo)
      setOpcion(opcion)
      setShow(true)
    } else if (opcion === '4') {
      setMensaje('Está seguro de cambiar el estado de este grupo asociado a la condición?')
      setIdGrupo(id_grupo)
      setEstado(estado)
      setOpcion(opcion)
      setShow(true)
    }
  }

  async function crudCondicionGrupo(id_condicion, id_grupo, opcion, estado) {
    let result
    if (opcion === '2') {
      const respuesta = await postCondicionGrupo('', id_condicion, '', '2', id_grupo, '')
      if (respuesta === 'OK') {
        await getCondicionGrupo(id_condicion, null).then((items) => {
          setList(items.detalle)
        })
      }
    } else if (opcion === '4') {
      if (estado === '0') {
        result = '1'
      } else {
        result = '0'
      }
      const respuesta = await postCondicionGrupo('', id_condicion, '', '4', id_grupo, result)
      if (respuesta === 'OK') {
        await getCondicionGrupo(id_condicion, null).then((items) => {
          setList(items.detalle)
        })
      }
    }
  }

  if (session) {
    if (location.id_condicion) {
      return (
        <>
          <Modal variant="primary" show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>Confirmación</Modal.Title>
            </Modal.Header>
            <Modal.Body>{mensaje}</Modal.Body>
            <Modal.Footer>
              <CButton color="secondary" onClick={handleClose}>
                Cancelar
              </CButton>
              <CButton
                color="primary"
                onClick={() =>
                  crudCondicionGrupo(location.id_condicion, idGrupo, opcion, estado).then(
                    handleClose,
                  )
                }
              >
                Aceptar
              </CButton>
            </Modal.Footer>
          </Modal>
          <div
            style={{
              width: '100%',
              textAlign: 'center',
              fontWeight: 'bold',
              borderColor: 'black',
            }}
          >
            <p>{location.descripcion}</p>
          </div>
          <CTable hover responsive align="middle" className="mb-0 border">
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell style={{ textAlign: 'center', width: '50%' }}>
                  Nombre Grupo
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center">Estado Grupo</CTableHeaderCell>
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
                    <CTableRow key={item.id_condicion}>
                      <CTableDataCell className="text-center">{item.identificador}</CTableDataCell>
                      <CTableDataCell className="text-center">{estado}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton
                          color="primary"
                          size="sm"
                          onClick={() =>
                            history.push({
                              pathname: '/condiciones/editarCG',
                              id_condiciongrupo: item.id_condiciongrupo,
                              id_condicion: item.id_condicion,
                              id_grupo: item.id_grupo,
                              identificador: item.identificador,
                              nombre: location.descripcion,
                              estado: item.estado_activo,
                            })
                          }
                        >
                          <FaPen />
                        </CButton>{' '}
                        <CButton
                          color="danger"
                          size="sm"
                          onClick={() => mostrarModal(item.id_grupo, '2', '')}
                        >
                          <FaTrash />
                        </CButton>{' '}
                        <CButton
                          color="info"
                          size="sm"
                          onClick={() => mostrarModal(item.id_grupo, '4', item.estado_activo)}
                        >
                          <BsToggles />
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
      history.push('/condiciones/condiciones')
      return (
        <div className="sin-sesion">
          NO SE CARGÓ EL CÓDIGO DE CONDICIÓN. REGRESE A LA PANTALLA DE PAGOS.
        </div>
      )
    }
  } else {
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default ConsultarPR
