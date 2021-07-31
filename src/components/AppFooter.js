import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <a href="https://coreui.io" target="_blank" rel="noopener noreferrer">
          Control de Pagos
        </a>
        <span className="ms-1">&copy; 2021 Grupo Sion.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Desarrollado por</span>
        <a href="https://coreui.io/react" target="_blank" rel="noopener noreferrer">
          Pendrogon
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
