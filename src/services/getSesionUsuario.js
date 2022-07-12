const API = `${process.env.REACT_APP_API_URL}sesionusuario`

export function getSesionUsuario(IdUsuario, token) {
  let ApiFinal = API
  let ApiWhere = ''
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

export function getSesionUsuarioGeneral(token) {
  let ApiFinal = `${process.env.REACT_APP_API_URL}sesionusuariogeneral`
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
