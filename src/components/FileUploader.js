import React, { useState } from 'react'
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import { jsPDF } from 'jspdf'

const FileUploader = (prop) => {
  const [prefijo, setValor] = useState('')
  const [prefijoTmp, setValorTmp] = useState('')

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
    const doc = new jsPDF({ compress: true })
    const imgProps = doc.getImageProperties(imagen)
    /* const pdfWidth = doc.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
    doc.addImage(imagen, 'PNG', 0, 0, pdfWidth, pdfHeight) */
    let imgWidth = doc.internal.pageSize.getWidth()
    let pageHeight = doc.internal.pageSize.getHeight()
    let imgHeight = (imgProps.height * imgWidth) / imgProps.width
    let heightLeft = imgHeight
    let position = 5
    doc.addImage(imagen, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST')
    heightLeft -= pageHeight
    while (heightLeft >= 0) {
      //let diferenciaPosicion = heightLeft - imgHeight
      position -= 297
      doc.addPage()
      doc.addImage(imagen, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST')
      heightLeft -= pageHeight
    }
    return doc.output('blob')
  }

  const getUploadParams = ({ file, meta }) => {
    const body = new FormData()
    let fileModificado
    if (file.type === 'image/png' || file.type === 'image/jpeg') {
      fileModificado = generarPDF(URL.createObjectURL(file))
    } else {
      fileModificado = file
    }
    body.append('original', file)
    body.append('image', fileModificado)
    body.append('prefijo', prefijo)
    body.append('prefijoTmp', prefijoTmp)

    return { url: `${process.env.REACT_APP_BACKEND_URL}upload.php`, body }
  }

  const handleChangeStatus = ({ meta, file }, status) => {
    let pago = prop.nombre
    let nombre
    if (status === 'preparing') {
      nombre = crearid(6) + '_' + pago
      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        setValor(nombre + '.pdf')
        setValorTmp(nombre)
      } else if (file.type === 'application/pdf') {
        setValor(nombre + '.pdf')
        setValorTmp(nombre)
      }
    }
    if (status === 'done') {
      prop.sendData(prefijo + '|original_' + prefijoTmp + '_' + file.name)
    }
    if (status === 'removed') {
      prop.sendDataRemove(prefijo + '|original_' + prefijoTmp + '_' + file.name)
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
      accept="image/*,application/pdf"
      inputWithFilesContent={(files) => 'Cargar otro'}
      submitButtonContent="Limpiar"
    />
  )
}

export default FileUploader
