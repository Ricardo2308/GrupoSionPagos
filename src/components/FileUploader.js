import React, { useState } from 'react'
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import { jsPDF } from 'jspdf'

const FileUploader = (prop) => {
  const [prefijo, setValor] = useState('')

  function crearid(length) {
    var result = []
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var largo = characters.length
    for (var i = 0; i < length; i++) {
      result.push(characters.charAt(Math.floor(Math.random() * largo)))
    }
    return result.join('')
  }

  function generarPDF(url) {
    var imagen = new Image()
    imagen.src = url
    const doc = new jsPDF()
    const imgProps = doc.getImageProperties(imagen)
    /* const pdfWidth = doc.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
    doc.addImage(imagen, 'PNG', 0, 0, pdfWidth, pdfHeight) */
    let imgWidth = doc.internal.pageSize.getWidth()
    let pageHeight = doc.internal.pageSize.getHeight()
    let imgHeight = (imgProps.height * imgWidth) / imgProps.width
    let heightLeft = imgHeight
    let position = 5
    doc.addImage(imagen, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position += heightLeft - imgHeight
      doc.addPage()
      doc.addImage(imagen, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    return doc.output('blob')
  }

  const getUploadParams = ({ file, meta }) => {
    const body = new FormData()
    if (file.type === 'image/png' || file.type === 'image/jpeg') {
      file = generarPDF(URL.createObjectURL(file))
    }
    body.append('image', file)
    body.append('prefijo', prefijo)
    return { url: `${process.env.REACT_APP_BACKEND_URL}upload.php`, body }
  }

  const handleChangeStatus = ({ meta, file }, status) => {
    let pago = prop.nombre
    let nombre
    if (status === 'preparing') {
      nombre = crearid(6) + '_' + pago
      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        setValor(nombre + '.pdf')
      } else if (file.type === 'application/pdf') {
        setValor(nombre + '.pdf')
      }
    }
    if (status === 'done') {
      prop.sendData(prefijo)
    }
    if (status === 'removed') {
      prop.sendDataRemove(prefijo)
    }
  }

  const handleSubmit = (files, allFiles) => {
    allFiles.forEach((f) => f.remove())
    prop.senDataRemoveAll()
  }

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      inputContent="Cargar Archivo"
      accept="image/*,audio/*,video/*,application/pdf"
      inputWithFilesContent={(files) => 'Cargar otro'}
      submitButtonContent="Limpiar"
    />
  )
}

export default FileUploader
