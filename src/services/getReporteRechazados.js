const API = `${process.env.REACT_APP_API_URL}rechazadosreporte`

export function getReporteRechazados(idUsuario, year, mes, campo, token) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idUsuario !== null) {
    ApiWhere += '/' + idUsuario
  }
  ApiFinal += ApiWhere
  var datos = {
    campo: campo,
    year: year,
    mes: mes,
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
