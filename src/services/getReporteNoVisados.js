const API = `${process.env.REACT_APP_API_URL}novisadoreporte`

export function getReporteNoVisados(idUsuario, inicial, final, token) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idUsuario !== null) {
    ApiWhere += '/' + idUsuario
  }
  ApiFinal += ApiWhere
  var datos = {
    fechaInicial: inicial,
    fechaFinal: final,
  }
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
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}
