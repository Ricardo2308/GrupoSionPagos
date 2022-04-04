const API = `${process.env.REACT_APP_API_URL}tipoflujo`

export function postTipoFlujo(idTipo, descripcion, inicial, estado, opcion, id_usuario) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_tipoflujo: idTipo,
    descripcion: descripcion,
    id_estadoinicial: inicial,
    activo: estado,
    opcion: opcion,
    id_usuario: id_usuario,
  }

  if (idTipo !== '' && opcion !== '') {
    ApiWhere += '/' + idTipo + '/' + opcion
  }
  ApiFinal += ApiWhere

  const data = JSON.stringify(datos)
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
