import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useSession } from 'react-use-session'
import { IdleTimeOutModal } from '../components/IdleTimeOutModal'
import IdleTimer from 'react-idle-timer'
import { postSesionUsuario } from '../services/postSesionUsuario'

const DefaultLayout = () => {
  const history = useHistory()
  const { session, clear } = useSession('PendrogonIT-Session')
  const [showModal, setshowModal] = useState(false)
  const [logoutTimer, setlogoutTimer] = useState(null)
  var idleTimer = null

  const onIdle = () => {
    togglePopup()
    const logoutTimerTmp = setTimeout(() => {
      handleLogout()
    }, 1000 * 10 * 1) // 5 seconds
    setlogoutTimer(logoutTimerTmp)
  }

  const togglePopup = () => {
    setshowModal(!showModal)
  }

  const handleStayLoggedIn = () => {
    console.log(session.limiteconexion)
    clearTimeout(logoutTimer)
    setlogoutTimer(null)
    idleTimer.reset()
    togglePopup()
  }

  const handleLogout = async () => {
    const respuesta = await postSesionUsuario(session.id, null, null, '2')
    if (respuesta === 'OK') {
      clear()
      history.push('/')
    }
  }

  if (session) {
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
          <IdleTimer
            ref={(ref) => {
              idleTimer = ref
            }}
            element={document}
            stopOnIdle={true}
            onIdle={onIdle}
            timeout={1000 * 60 * parseInt(session == null ? 1 : session.limiteconexion)} // 10 seconds
          />

          <IdleTimeOutModal
            showModal={showModal}
            togglePopup={togglePopup}
            handleStayLoggedIn={handleStayLoggedIn}
          />
        </div>
      )
    }
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default DefaultLayout
