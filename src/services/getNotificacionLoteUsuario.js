const API = `${process.env.REACT_APP_API_URL}usuarionotificaciontransaccion`

export function getNotificacionLoteUsuario(idUsuario) {
  let ApiFinal = API
  let ApiWhere = ''
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
