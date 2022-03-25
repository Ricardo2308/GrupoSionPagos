import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useSession } from 'react-use-session'

const DefaultLayout = () => {
  const { session, clear } = useSession('PendrogonIT-Session')
  if (session.cantidadIngresos == '0') {
    return (
      <div style={{ display: 'flex', width: '100%' }}>
        <div id="header"></div>
        <div style={{ width: '100%' }} className="wrapper d-flex flex-column min-vh-100 bg-light">
          <div className="body flex-grow-1 px-3">
            <AppContent />
          </div>
          <AppFooter />
        </div>
      </div>
    )
  } else {
    return (
      <div style={{ display: 'flex', width: '100%' }}>
        <aside id="header">
          <AppSidebar className="sticky" />
        </aside>
        <article
          style={{ width: '100%' }}
          className="wrapper d-flex flex-column min-vh-100 bg-light"
        >
          <AppHeader />
          <div className="body flex-grow-1 px-3">
            <AppContent />
          </div>
          <AppFooter />
        </article>
      </div>
    )
  }
}

export default DefaultLayout
