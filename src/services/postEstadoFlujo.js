const API = `${process.env.REACT_APP_API_URL}estadoflujo`

export function postEstadoFlujo(
  idEstado,
  idEstadoPadre,
  descripcion,
  estado,
  opcion,
  id_usuario,
  token,
) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_estadoflujo: idEstado,
    id_estadoflujopadre: idEstadoPadre,
    descripcion: descripcion,
    activo: estado,
    opcion: opcion,
    id_usuario: id_usuario,
  }

  if (idEstado !== '' && opcion !== '') {
    ApiWhere += '/' + idEstado + '/' + opcion
  }
  ApiFinal += ApiWhere

  const data = JSON.stringify(datos)
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
