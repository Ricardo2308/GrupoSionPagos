const API = `${process.env.REACT_APP_BACKEND_URL}post_archivoflujo.php`

export function postArchivoFlujo(
  idArchivoFlujo,
  idFlujo,
  idUsuario,
  descripcion,
  archivos,
  estado,
  opcion,
  archivo,
) {
  var datos = {
    id_archivoflujo: idArchivoFlujo,
    id_flujo: idFlujo,
    id_usuario: idUsuario,
    descripcion: descripcion,
    archivos: archivos,
    estado: estado,
    opcion: opcion,
    url: 'http://sionpagos.pendrogon.com/archivos/',
    url_archivo: archivo,
  }
  const data = JSON.stringify(datos)
  return fetch(API, {
    method: 'POST',
    body: data,
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json;charset=UTF-8',
    },
  })
    .then((response) => response.json())
    .then((response) => {
      return response
    })
    .catch((error) => error)
}
