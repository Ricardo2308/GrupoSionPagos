const API = `${process.env.REACT_APP_API_URL}sesionusuario`

export function getSesionUsuario(IdUsuario) {
  let ApiFinal = API
  let ApiWhere = ''
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

export function getSesionUsuarioGeneral() {
  let ApiFinal = `${process.env.REACT_APP_API_URL}sesionusuariogeneral`
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}
