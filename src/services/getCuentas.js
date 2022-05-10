const API = `${process.env.REACT_APP_API_URL}cuentas`

export function getCuentas(idCuenta, Nombre, token) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idCuenta !== null) {
    ApiWhere += '/' + idCuenta
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
