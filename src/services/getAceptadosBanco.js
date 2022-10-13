const API = `${process.env.REACT_APP_API_URL}aceptadosbanco`

export function getAceptadosBanco(idUsuario, Tipo, token) {
  let ApiFinal = API
  let ApiWhere = ''

  if (idUsuario !== null) {
    ApiWhere += '/' + idUsuario
  }
  if (Tipo !== null) {
    ApiWhere += '/' + Tipo
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
    },
  })
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}