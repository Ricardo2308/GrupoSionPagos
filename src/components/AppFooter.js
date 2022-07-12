import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <span style={{ color: '#0C70AA' }}>Control de Pagos</span>
        <span className="ms-1">&copy; 2021 Grupo Sion.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Desarrollado por</span>
        <span style={{ color: '#0C70AA' }}>Pendrogon</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
