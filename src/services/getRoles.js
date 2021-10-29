const API = `${process.env.REACT_APP_API_URL}roles`

export function getRoles(idRol, Descripcion) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idRol !== null) {
    ApiWhere += '/' + idRol
  }
  if (Descripcion !== null) {
    ApiWhere += '/' + Descripcion
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}
