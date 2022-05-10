const API = `${process.env.REACT_APP_API_URL}politicas`

export function postCrudPoliticas(
  idPolitica,
  descripcion,
  identificador,
  valor,
  estado,
  opcion,
  id_usuario,
  token,
) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_politica: idPolitica,
    descripcion: descripcion,
    identificador: identificador,
    valor: valor,
    activo: estado,
    opcion: opcion,
    id_usuario: id_usuario,
  }

  if (idPolitica !== '' && opcion !== '') {
    ApiWhere += '/' + idPolitica + '/' + opcion
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
