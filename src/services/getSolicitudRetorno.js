const API = `${process.env.REACT_APP_API_URL}solicitudretorno`

export function getSolicitudRetorno(Tipo, idUsuario) {
  let ApiFinal = API
  let ApiWhere = ''

  if (Tipo !== null) {
    ApiWhere += '/' + Tipo
  }
  if (idUsuario !== null) {
    ApiWhere += '/' + idUsuario
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}
