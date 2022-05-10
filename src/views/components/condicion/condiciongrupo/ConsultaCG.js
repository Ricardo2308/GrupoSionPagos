import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { postCondicionGrupo } from '../../../../services/postCondicionGrupo'
import { postSesionUsuario } from '../../../../services/postSesionUsuario'
import { getCondicionGrupo } from '../../../../services/getCondicionGrupo'
import { useIdleTimer } from 'react-idle-timer'
import { useSession } from 'react-use-session'
import { Modal } from 'react-bootstrap'
import { FaTrash, FaPen } from 'react-icons/fa'
import { BsToggles } from 'react-icons/bs'
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

const ConsultarPR = () => {
  const history = useHistory()
  const location = useLocation()
  const [time, setTime] = useState(null)
  const { session, clear } = useSession('PendrogonIT-Session')
  const [results, setList] = useState([])
  const [show, setShow] = useState(false)
  const [idGrupo, setIdGrupo] = useState(0)
  const [estado, setEstado] = useState(0)
  const [opcion, setOpcion] = useState(0)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    let mounted = true
    getCondicionGrupo(location.id_condicion, null, session.api_token).then((items) => {
      if (mounted) {
        setList(items.detalle)
      }
    })
    return () => (mounted = false)
  }, [])

  function mostrarModal(id_grupo, opcion, estado) {
    if (opcion == 1) {
      setMensaje('Está seguro de eliminar este grupo de autorización?')
      setIdGrupo(id_grupo)
      setOpcion(opcion)
      setShow(true)
    } else if (opcion == 2) {
      setMensaje('Está seguro de cambiar el estado de este grupo de autorización?')
      setIdGrupo(id_grupo)
      setEstado(estado)
      setOpcion(opcion)
      setShow(true)
    }
  }

  async function crudCondicionGrupo(id_condicion, id_condiciongrupo, opcion, estado) {
    let result
    if (opcion == 1) {
      const respuesta = await postCondicionGrupo(
        id_condiciongrupo,
        '',
        '',
        '1',
        '',
        '',
        session.id,
        session.api_token,
      )
      if (respuesta === 'OK') {
        await getCondicionGrupo(id_condicion, null, session.api_token).then((items) => {
          setList(items.detalle)
        })
      }
    } else if (opcion == 2) {
      if (estado == 0) {
        result = '1'
      } else {
        result = '0'
      }
      const respuesta = await postCondicionGrupo(
        id_condiciongrupo,
        '',
        '',
        '3',
        '',
        result,
        session.id,
        session.api_token,
      )
      if (respuesta === 'OK') {
        await getCondicionGrupo(id_condicion, null, session.api_token).then((items) => {
          setList(items.detalle)
        })
      }
    } else if (opcion == 3) {
      setShow(false)
    }
  }

  async function Cancelar(opcion) {
    if (opcion == 3) {
      let idUsuario = 0
      if (session) {
        idUsuario = session.id
      }
      const respuesta = await postSesionUsuario(idUsuario, null, null, '2', session.api_token)
      if (respuesta === 'OK') {
        clear()
        history.push('/')
      }
    } else {
      setShow(false)
    }
  }

  if (session) {
    if (location.id_condicion) {
      return (
        <>
          <Modal variant="primary" show={show} onHide={() => Cancelar(opcion)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Confirmación</Modal.Title>
            </Modal.Header>
            <Modal.Body>{mensaje}</Modal.Body>
            <Modal.Footer>
              <CButton color="secondary" onClick={() => Cancelar(opcion)}>
                Cancelar
              </CButton>
              <CButton
                color="primary"
                onClick={() =>
                  crudCondicionGrupo(location.id_condicion, idGrupo, opcion, estado).then(() =>
                    Cancelar(1),
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
                if (item.eliminado == 0) {
                  if (item.activo == 1) {
                    estado = 'Activo'
                  }
                  return (
                    <CTableRow key={item.id_condiciongrupo}>
                      <CTableDataCell className="text-center">{item.identificador}</CTableDataCell>
                      <CTableDataCell className="text-center">{estado}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton
                          color="primary"
                          size="sm"
                          title="Elegir Nuevo Grupo"
                          onClick={() =>
                            history.push({
                              pathname: '/condiciones/editarCG',
                              id_condiciongrupo: item.id_condiciongrupo,
                              id_condicion: item.id_condicion,
                              id_grupo: item.id_grupo,
                              identificador: item.identificador,
                              nombre: location.descripcion,
                              estado: item.activo,
                            })
                          }
                        >
                          <FaPen />
                        </CButton>{' '}
                        <CButton
                          color="danger"
                          size="sm"
                          title="Eliminar Grupo"
                          onClick={() => mostrarModal(item.id_condiciongrupo, 1, '')}
                        >
                          <FaTrash />
                        </CButton>{' '}
                        <CButton
                          color="info"
                          size="sm"
                          title="Cambiar Estado"
                          onClick={() => mostrarModal(item.id_condiciongrupo, 2, item.activo)}
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
      history.push('/condiciones')
      return (
        <div className="sin-sesion">
          NO SE CARGÓ EL CÓDIGO DE CONDICIÓN. REGRESE A LA PANTALLA DE PAGOS.
        </div>
      )
    }
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default ConsultarPR
