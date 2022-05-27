const API = `${process.env.REACT_APP_API_URL}archivosflujo`

export function postArchivoFlujo(
  idArchivoFlujo,
  idFlujo,
  idUsuario,
  descripcion,
  archivos,
  nombre_archivo,
  opcion,
  token,
) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_archivoflujo: idArchivoFlujo,
    id_flujo: idFlujo,
    id_usuario: idUsuario,
    descripcion: descripcion,
    archivos: archivos,
    nombre_archivo: nombre_archivo,
    opcion: opcion,
    url: `${process.env.REACT_APP_URL_ARCHIVOS}`,
  }
  const data = JSON.stringify(datos)

  if (idArchivoFlujo !== '' && opcion !== '') {
    ApiWhere += '/' + idArchivoFlujo + '/' + opcion
  }
  ApiFinal += ApiWhere

  return fetch(ApiFinal, {
    method: 'POST',
    body: data,
    headers: {
      Authorization: 'Bearer ' + token,
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
