import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useSession } from 'react-use-session'
import { Alert, Button, Spinner } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import { postArchivoFlujo } from '../../../../services/postArchivoFlujo'
import { FiUser, FiFile, FiDownloadCloud, FiSettings } from 'react-icons/fi'
import { FaArrowLeft, FaTrash } from 'react-icons/fa'
import '../../../../scss/estilos.scss'
import {
  CButton,
  CCard,
  CCardBody,
  CContainer,
  CForm,
  CInputGroupText,
  CFormControl,
  CInputGroup,
  CFormSelect,
} from '@coreui/react'
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { canvasPreview } from './canvasPreview'
import { useDebounceEffect } from './useDebounceEffect'
import cropImage from './cropImage'
import { jsPDF } from 'jspdf'
//Agregar la validación al botón de generar
//Desactivar botones y agregar loading al momento de generar el archivo
const EditarArchivoFlujo = () => {
  const history = useHistory()
  const location = useLocation()
  const { session } = useSession('PendrogonIT-Session')
  const [crop, setCrop] = useState()
  const [completedCrop, setCompletedCrop] = useState()
  const previewCanvasRef = useRef()
  const imgRef = useRef()
  const [imgSrc, setImgSrc] = useState(location.ArchivoOriginal)
  const [aspect, setAspect] = useState(undefined)
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const [imagenes, setImagenes] = useState([])
  const [direcciones, setDirecciones] = useState([])
  const [mostrarMensaje, setMostrarMensaje] = useState(false)
  const [deshabilitarCortar, setDeshabilitarCortar] = useState(false)
  const [deshabilitarGenerar, setDeshabilitarGenerar] = useState(true)
  const [deshabilitarLimpiar, setDeshabilitarLimpiar] = useState(true)
  const [mostrarCargando, setMostrarCargando] = useState(false)

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspect))
    }
  }

  function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight,
      ),
      mediaWidth,
      mediaHeight,
    )
  }

  async function GuardarCorte() {
    var img1 = new Image()
    img1.src = imgSrc
    img1.crossOrigin = 'anonymous'
    const { blob: croppedBlob, blobUrl, revokeUrl } = await cropImage(
      imgRef.current,
      imgRef.current,
      completedCrop,
      true,
    )
    setImagenes([...imagenes, croppedBlob])
    setDirecciones([...direcciones, blobUrl])
    setDeshabilitarGenerar(false)
    setDeshabilitarLimpiar(false)
  }

  function Limpiar() {
    setCompletedCrop(null)
    setCrop(null)
    setImagenes([])
    setDirecciones([])
    setDeshabilitarGenerar(true)
    setDeshabilitarLimpiar(true)
  }

  function Eliminar(imagen) {
    setDirecciones([
      ...direcciones.filter(function (item) {
        return item !== imagen
      }),
    ])
  }

  function crearid(length) {
    var result = []
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var largo = characters.length
    for (var i = 0; i < length; i++) {
      result.push(characters.charAt(Math.floor(Math.random() * largo)))
    }
    return result.join('')
  }

  async function generarPDF() {
    const doc = new jsPDF({ compress: true })
    let contador = 0
    direcciones.forEach((item) => {
      contador++
      var imagen = new Image()
      imagen.src = item
      const imgProps = doc.getImageProperties(imagen)
      let imgWidth = doc.internal.pageSize.getWidth() - 5
      let pageHeight = doc.internal.pageSize.getHeight()
      let imgHeight = (imgProps.height * imgWidth) / imgProps.width
      if (contador > 1) {
        doc.addPage()
      }
      doc.addImage(imagen, 'PNG', -1, 0, imgWidth, imgHeight, undefined, 'FAST')
    })
    return doc.output('blob')
  }

  async function GuardarPdf() {
    setMostrarCargando(true)
    setDeshabilitarCortar(false)
    setDeshabilitarGenerar(true)
    setDeshabilitarLimpiar(true)
    setTimeout(() => {
      const data = new FormData()
      let nombre = crearid(6) + '_' + location.pago + '.pdf'
      //let fileModificado = generarPDF().then(()=>{
      generarPDF().then((fileModificado) => {
        data.append('image', fileModificado)
        data.append('prefijo', nombre)
        fetch(`${process.env.REACT_APP_BACKEND_URL}upload.php`, {
          method: 'POST',
          body: data,
        })
          .then(function (response) {
            if (response.status === 200) {
              setCompletedCrop(null)
              setCrop(null)
              setImagenes([])
              setDirecciones([])

              return postArchivoFlujo(
                location.id_archivoflujo,
                location.id_flujo,
                session.id,
                '',
                '',
                nombre,
                '2',
                session.api_token,
              )
            }
          })
          .then(function (response2) {
            if (response2 == 'OK') {
              history.push({
                pathname: '/archivoflujo/nuevo',
                id_flujo: location.id_flujo,
                pago: location.pago,
                grupo: location.grupo,
                estado: location.estado,
              })
            }
          })
          .catch((error) => error)
      })
    }, 3000)
  }

  useEffect(() => {
    let mounted = true
    return () => (mounted = false)
  }, [])

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.

        if (completedCrop.height > 657) {
          setMostrarMensaje(true)
          /* setDeshabilitarCortar(true)
          setDeshabilitarGenerar(true)
          setDeshabilitarLimpiar(true) */
        } else {
          setMostrarMensaje(false)
          /* setDeshabilitarCortar(false)
          if (direcciones.length > 0) {
            setDeshabilitarGenerar(false)
            setDeshabilitarLimpiar(false)
          } */
        }
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, scale, rotate)
      }
    },
    100,
    [completedCrop, scale, rotate],
  )
  if (session) {
    if (location.id_archivoflujo) {
      return (
        <div style={{ flexDirection: 'row' }}>
          <div style={{ width: '25%', marginLeft: '10px' }}>
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                history.push({
                  pathname: '/archivoflujo/nuevo',
                  id_flujo: location.id_flujo,
                  pago: location.pago,
                  grupo: location.grupo,
                  estado: location.estado,
                })
              }
            >
              <FaArrowLeft />
              &nbsp;&nbsp;Regresar
            </Button>
          </div>
          <br />
          <br />
          <CContainer>
            <div
              style={{ width: '95%', display: 'flex', gap: '10px', justifyContent: 'flex-start' }}
            >
              <div style={{ width: '50%', height: '800px', overflow: 'auto' }}>
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspect}
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imgSrc}
                    style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              </div>
              <div style={{ width: '50%' }}>
                <Button
                  variant="success"
                  size="sm"
                  disabled={deshabilitarCortar}
                  onClick={() => {
                    GuardarCorte()
                  }}
                >
                  Cortar
                </Button>{' '}
                <Button
                  variant="primary"
                  size="sm"
                  disabled={deshabilitarGenerar}
                  onClick={() => {
                    GuardarPdf()
                  }}
                >
                  Generar documento
                </Button>{' '}
                <Button
                  variant="danger"
                  size="sm"
                  disabled={deshabilitarLimpiar}
                  onClick={() => {
                    Limpiar()
                  }}
                >
                  Limpiar
                </Button>
                <br />
                <Spinner animation="border" className={!mostrarCargando ? 'd-none' : ''} />
                <Alert variant="warning" className={!mostrarMensaje ? 'd-none' : ''}>
                  {
                    'El área seleccionada es más grande que una página, es posible que al generar el documento se distorsione la imagen.'
                  }
                </Alert>
                <br />
                <div>
                  {Boolean(completedCrop) && (
                    <canvas
                      ref={previewCanvasRef}
                      style={{
                        border: '1px solid black',
                        objectFit: 'contain',
                        width: completedCrop.width,
                        height: completedCrop.height,
                      }}
                    />
                  )}
                </div>
                <div style={{ height: '400px', overflow: 'auto' }}>
                  {direcciones.map((item, i) => {
                    return (
                      <>
                        <div key={i + 100}>
                          <br />
                          <div key={i + 200} style={{ display: 'flex' }}>
                            <div key={i + 300} style={{ width: '50%' }}>
                              <h2 key={i + 1000}>Página {i + 1}</h2>
                            </div>
                            <div key={i + 400} style={{ width: '50%' }}>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => {
                                  Eliminar(item)
                                }}
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </div>
                          <br />
                          <img key={i} src={item} style={{ width: '50%' }} />
                          <br />
                        </div>
                        <br />
                      </>
                    )
                  })}
                </div>
              </div>
            </div>
          </CContainer>
        </div>
      )
    } else {
      history.goBack()
      return (
        <div className="sin-sesion">
          NO SE CARGÓ EL CÓDIGO DEL ARCHIVO. REGRESE A LA PANTALLA DE PAGOS.
        </div>
      )
    }
  } else {
    history.push('/')
    return <div className="sin-sesion">SIN SESIÓN ACTIVA.</div>
  }
}

export default EditarArchivoFlujo
