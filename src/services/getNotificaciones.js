const API = `${process.env.REACT_APP_API_URL}notificacion`

export function getNotificaciones(IdFlujo, IdUsuario) {
  let ApiFinal = API
  let ApiWhere = ''
  if (IdFlujo !== null) {
    ApiWhere += '/' + IdFlujo
  }
  if (IdUsuario !== null) {
    ApiWhere += '/' + IdUsuario
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}
