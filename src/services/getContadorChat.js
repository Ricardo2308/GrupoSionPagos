const API = `${process.env.REACT_APP_API_URL}contadorchat`

export function getContadorChat(idPago, idUsuario, token) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idPago !== null) {
    ApiWhere += '/' + idPago
  }
  if (idUsuario !== null) {
    ApiWhere += '/' + idUsuario
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
