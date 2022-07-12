const API = `${process.env.REACT_APP_API_URL}reportesflujos`

export function getReportesFlujos(opcion, year, mes, token) {
  let ApiFinal = API
  let ApiWhere = ''
  if (opcion !== null && year !== null && mes !== null) {
    ApiWhere += '/' + opcion + '/' + year + '/' + mes
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
