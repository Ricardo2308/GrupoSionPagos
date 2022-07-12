const API = `${process.env.REACT_APP_API_URL}monedas`

export function getMonedas(idMoneda, Nombre, token) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idMoneda !== null) {
    ApiWhere += '/' + idMoneda
  }
  if (Nombre !== null) {
    ApiWhere += '/' + Nombre
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
