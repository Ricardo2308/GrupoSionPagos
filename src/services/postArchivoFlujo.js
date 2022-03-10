const API = `${process.env.REACT_APP_API_URL}archivosflujo`

export function postArchivoFlujo(
  idArchivoFlujo,
  idFlujo,
  idUsuario,
  descripcion,
  archivos,
  opcion,
) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_archivoflujo: idArchivoFlujo,
    id_flujo: idFlujo,
    id_usuario: idUsuario,
    descripcion: descripcion,
    archivos: archivos,
    opcion: opcion,
    url: 'http://34.208.193.210/pagos/archivos/',
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
