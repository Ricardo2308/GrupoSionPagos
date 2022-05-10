const API = `${process.env.REACT_APP_API_URL}perfiles`

export function getPerfiles(idPerfil, Descripcion, token) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idPerfil !== null) {
    if (ApiWhere.length > 0) {
      ApiWhere += '&id=' + idPerfil
    } else {
      ApiWhere += '?id=' + idPerfil
    }
  }
  if (Descripcion !== null) {
    if (ApiWhere.length > 0) {
      ApiWhere += '&descripcion=' + Descripcion
    } else {
      ApiWhere += '?descripcion=' + Descripcion
    }
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

export function getPerfilesParaAsignar(idUsuario, token) {
  let ApiFinal = API
  let ApiWhere = 'paraasignar/' + idUsuario
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
