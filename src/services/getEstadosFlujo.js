const API = `${process.env.REACT_APP_API_URL}estadoflujo`

export function getEstadosFlujo(idEstado, descripcion, token) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idEstado !== null) {
    if (ApiWhere.length > 0) {
      ApiWhere += '&id_estadoflujo=' + idEstado
    } else {
      ApiWhere += '?id_estadoflujo=' + idEstado
    }
  }
  if (descripcion !== null) {
    if (ApiWhere.length > 0) {
      ApiWhere += '&descripcion=' + descripcion
    } else {
      ApiWhere += '?descripcion=' + descripcion
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
