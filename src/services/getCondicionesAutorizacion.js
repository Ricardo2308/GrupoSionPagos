const API = `${process.env.REACT_APP_API_URL}condicionautorizacion`

export function getCondicionesAutorizacion(idCondicion, Descripcion, token) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idCondicion !== null) {
    if (ApiWhere.length > 0) {
      ApiWhere += '&id_condicionautorizacion=' + idCondicion
    } else {
      ApiWhere += '?id_condicionautorizacion=' + idCondicion
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
