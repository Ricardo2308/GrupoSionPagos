const API = `${process.env.REACT_APP_API_URL}consultorpagadosbanco`

export function getConsultorPagadosBanco(idUsuario, token) {
  let ApiFinal = API
  let ApiWhere = ''
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
