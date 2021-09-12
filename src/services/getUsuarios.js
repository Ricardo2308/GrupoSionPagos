const API = `${process.env.REACT_APP_API_URL}usuarios`

export function getUsuarios(idUsuario, Apellido, Correo, Password) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idUsuario !== null) {
    ApiWhere += '/' + idUsuario
  }
  if (Apellido !== null) {
    if (ApiWhere.length > 0) {
      ApiWhere += '&apellido=' + Apellido
    } else {
      ApiWhere += '?apellido=' + Apellido
    }
  }
  if (Correo !== null) {
    if (ApiWhere.length > 0) {
      ApiWhere += '&correo=' + Correo
    } else {
      ApiWhere += '?correo=' + Correo
    }
  }
  if (Password !== null) {
    if (ApiWhere.length > 0) {
      ApiWhere += '&password=' + Password
    } else {
      ApiWhere += '?password=' + Password
    }
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((err) => err)
}
