import React, { useState } from 'react'
import { useSession } from 'react-use-session'
import { useHistory } from 'react-router-dom'
import '../../../../scss/estilos.scss'
import Button from 'react-bootstrap/Button'
import { RiBankLine, RiFileTransferLine, RiDownload2Fill } from 'react-icons/ri'

const AutorizacionGeneral = (prop) => {
  const history = useHistory()
  const { session } = useSession('PendrogonIT-Session')

  if (session) {
    return (
      <>
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '30px' }}
        >
          <div
            style={{ width: '50%', display: 'flex', justifyContent: 'center' }}
            className="d-grid gap-3"
          >
            <h1 style={{ width: '100%', textAlign: 'center' }}>Autorización</h1>
            <Button
              variant="secondary"
              href={'/#/pagos/bancario'}
              size="lg"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0px',
                width: 600,
              }}
            >
              <RiBankLine /> &nbsp;Bancaria
            </Button>
            <Button
              variant="secondary"
              href={'/#/pagos/interna'}
              size="lg"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0px',
                width: 600,
              }}
            >
              <RiDownload2Fill /> &nbsp;Interna
            </Button>
            <Button
              variant="secondary"
              href={'/#/pagos/transferencia'}
              size="lg"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0px',
                width: 600,
              }}
            >
              <RiFileTransferLine /> &nbsp;Transferencia
            </Button>
          </div>
        </div>
      </>
    )
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default AutorizacionGeneral
