import React, { useState } from 'react'
import { CButton } from '@coreui/react'
import { Modal } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import FlujoSolicitud from './FlujoSolicitud'
import FlujoOferta from './FlujoOferta'
import FlujoOrden from './FlujoOrden'
import DetalleFlujo from './DetalleFlujo'
import ArchivosFlujo from './ArchivosFlujoF'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import { postFlujos } from '../../../../services/postFlujos'
import { useSession } from 'react-use-session'
import '../../../../scss/estilos.scss'

const FlujoTabs = () => {
  const history = useHistory()
  const location = useLocation()
  const { session } = useSession('PendrogonIT-Session')
  const [activeIndex, setActiveIndex] = useState(0)
  const [show, setShow] = useState(false)
  const [idFlujo, setIdFlujo] = useState(0)

  const handleClose = () => setShow(false)

  const handleChange = (event, activeIndex) => {
    setActiveIndex(activeIndex)
  }

  function mostrarModal(id_flujo) {
    setIdFlujo(id_flujo)
    setShow(true)
  }

  async function rechazarPago(id_flujo) {
    const respuesta = await postFlujos(id_flujo, '2')
    if (respuesta === 'OK') {
      history.push('/pagos')
    }
  }

  if (session) {
    if (location.id_flujo) {
      return (
        <div>
          <Modal responsive variant="primary" show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>Confirmación</Modal.Title>
            </Modal.Header>
            <Modal.Body>Está seguro de rechazar el pago?</Modal.Body>
            <Modal.Footer>
              <CButton color="secondary" onClick={handleClose}>
                Cancelar
              </CButton>
              <CButton color="primary" onClick={() => rechazarPago(idFlujo).then(handleClose)}>
                Aceptar
              </CButton>
            </Modal.Footer>
          </Modal>
          <div className="float-right" style={{ marginBottom: '20px' }}>
            <CButton color="success" size="sm" onClick={() => history.push('/pagos')}>
              Aceptar
            </CButton>{' '}
            <CButton color="danger" size="sm" onClick={() => mostrarModal(location.id_flujo)}>
              Rechazar
            </CButton>
          </div>
          <div
            style={{
              display: 'flex',
              width: '100%',
            }}
          >
            <VerticalTabs value={activeIndex} onChange={handleChange}>
              <MyTab label="Solicitud" />
              <MyTab label="Oferta Compra" />
              <MyTab label="Orden Compra" />
              <MyTab label="Ingreso Bodega" />
              <MyTab label="Facturas" />
              <MyTab label="Detalle" />
              <MyTab label="Archivos" />
              <MyTab label="Bitácora" />
            </VerticalTabs>

            {activeIndex === 0 && (
              <TabContainer>
                <FlujoSolicitud id_flujo={location.id_flujo} />
              </TabContainer>
            )}
            {activeIndex === 1 && (
              <TabContainer>
                <FlujoOferta id_flujo={location.id_flujo} />
              </TabContainer>
            )}
            {activeIndex === 2 && (
              <TabContainer>
                <FlujoOrden id_flujo={location.id_flujo} />
              </TabContainer>
            )}
            {activeIndex === 3 && <TabContainer>Ingreso Bodega</TabContainer>}
            {activeIndex === 4 && <TabContainer>Facturas</TabContainer>}
            {activeIndex === 5 && (
              <TabContainer>
                <DetalleFlujo id_flujo={location.id_flujo} />
              </TabContainer>
            )}
            {activeIndex === 6 && (
              <TabContainer>
                <ArchivosFlujo id_flujo={location.id_flujo} />
              </TabContainer>
            )}
            {activeIndex === 7 && <TabContainer>Bitácora</TabContainer>}
          </div>
        </div>
      )
    } else {
      history.push('/pagos')
      return (
        <div className="sin-sesion">
          NO SE CARGÓ EL NÚMERO DE PAGO. REGRESE A LA PANTALLA DE PAGOS.
        </div>
      )
    }
  } else {
    history.push('/dashboard')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

const VerticalTabs = withStyles({
  flexContainer: {
    flexDirection: 'column',
  },
  indicator: {
    display: 'none',
  },
})(Tabs)

const MyTab = withStyles((theme) => ({
  root: {
    backgroundColor: 'white',
    borderRadius: theme.shape.borderRadius,
    height: '40px',
  },
  wrapper: {
    backgroundColor: 'white',
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
  },
  selected: {
    color: 'blue',
    borderBottom: '2px solid blue',
  },
}))(Tab)

function TabContainer(prop) {
  return (
    <Typography component="div" style={{ marginLeft: '26px', width: '79%' }}>
      {prop.children}
    </Typography>
  )
}

export default FlujoTabs
