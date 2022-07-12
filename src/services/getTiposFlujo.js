const API = `${process.env.REACT_APP_API_URL}tipoflujo`

export function getTiposFlujo(idTipo, descripcion, token) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idTipo !== null) {
    if (ApiWhere.length > 0) {
      ApiWhere += '&id_tipoflujo=' + idTipo
    } else {
      ApiWhere += '?id_tipoflujo=' + idTipo
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
