const API = `${process.env.REACT_APP_API_URL}archivosflujo`

export function getArchivosFlujo(idFlujo, idUsuario, token) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idFlujo !== null) {
    ApiWhere += '/0/' + idFlujo
  }
  if (idUsuario !== null) {
    ApiWhere += '/' + idUsuario + '/0'
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

export function getFlujosConArchivos(idUsuario, token) {
  let ApiFinal = `${process.env.REACT_APP_API_URL}flujosconarchivos`
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
