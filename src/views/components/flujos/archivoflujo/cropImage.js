const getBlobFromCanvas = (canvas, file, withUrl) =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        blob.name = file.name
        blob.lastModified = file.lastModified

        let blobUrl, revokeUrl

        if (withUrl) {
          blobUrl = URL.createObjectURL(blob)
          revokeUrl = () => URL.revokeObjectURL(blobUrl)
        }

        resolve({ blob, blobUrl, revokeUrl })
      } else {
        reject(new Error('Canvas is empty'))
      }
    }, file.type)
  })

const cropImage = async (image, file, crop, withUrl = false) => {
  const canvas = document.createElement('canvas')
  const TO_RADIANS = Math.PI / 180

  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height
  const pixelRatio = window.devicePixelRatio
  const ctx = canvas.getContext('2d')

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

  ctx.scale(pixelRatio, pixelRatio)
  ctx.imageSmoothingQuality = 'high'

  const cropX = crop.x * scaleX
  const cropY = crop.y * scaleY

  const rotateRads = 0 * TO_RADIANS
  const centerX = image.naturalWidth / 2
  const centerY = image.naturalHeight / 2

  ctx.save()
  ctx.translate(-cropX, -cropY)
  // 4) Move the origin to the center of the original position
  ctx.translate(centerX, centerY)
  // 3) Rotate around the origin
  ctx.rotate(rotateRads)
  // 2) Scale the image
  ctx.scale(1, 1)
  // 1) Move the center of the image to the origin (0,0)
  ctx.translate(-centerX, -centerY)
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
  )

  return await getBlobFromCanvas(canvas, file, withUrl)
}

export default cropImage
