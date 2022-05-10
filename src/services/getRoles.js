const API = `${process.env.REACT_APP_API_URL}roles`

export function getRoles(idRol, Descripcion, token) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idRol !== null) {
    ApiWhere += '/' + idRol
  }
  if (Descripcion !== null) {
    ApiWhere += '/' + Descripcion
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
