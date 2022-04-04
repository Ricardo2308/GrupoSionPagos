import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

export const IdleTimeOutModal = ({ showModal, togglePopup, handleStayLoggedIn }) => {
  return (
    <Modal show={showModal} onHide={togglePopup}>
      <Modal.Header closeButton>
        <Modal.Title>Mucho tiempo sin actividad</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Ha estado por mucho tiempo sin actividad en la aplicación. ¿Desea continuar?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleStayLoggedIn}>
          Continuar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
