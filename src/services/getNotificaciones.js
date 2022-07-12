const API = `${process.env.REACT_APP_API_URL}notificacion`

export function getNotificaciones(IdFlujo, IdUsuario, token) {
  let ApiFinal = API
  let ApiWhere = ''
  if (IdFlujo !== null) {
    ApiWhere += '/' + IdFlujo
  }
  if (IdUsuario !== null) {
    ApiWhere += '/' + IdUsuario
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
