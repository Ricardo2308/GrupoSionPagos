import React from 'react'
import { useHistory } from 'react-router-dom'
import logo from '../../../assets/icons/logo.png'
import { CButton, CCard, CCardBody, CCardGroup, CContainer, CForm, CRow, CCol } from '@coreui/react'

const CorreoEnviado = () => {
  const history = useHistory()

  return (
    <>
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md="11">
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm>
                      <h1 className="recuperar-titulo">Correo Enviado</h1>
                      <p className="text-medium-emphasis">
                        Se le ha enviado un link al correo asociado a su cuenta para confirmar el
                        cambio de la contraseña.
                      </p>
                      <CButton color="link" onClick={() => history.push('/')}>
                        Regresar al Login
                      </CButton>
                    </CForm>
                  </CCardBody>
                </CCard>
                <CCard className="text-white py-5">
                  <CCardBody className="text-center">
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div style={{ width: '80%', height: '80%', backgroundColor: 'transparent' }}>
                        <img style={{ width: '80%' }} src={logo} />
                      </div>
                    </div>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  )
}

export default CorreoEnviado
