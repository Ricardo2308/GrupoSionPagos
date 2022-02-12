const API = `${process.env.REACT_APP_API_URL}compensados`

export function getCompensados(idUsuario, Tipo) {
  let ApiFinal = API
  let ApiWhere = ''

  if (idUsuario !== null) {
    ApiWhere += '/' + idUsuario
  }
  if (Tipo !== null) {
    ApiWhere += '/' + Tipo
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}
