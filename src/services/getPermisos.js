const API = `${process.env.REACT_APP_API_URL}permisos`

export function getPermisos(idPermiso, Descripcion) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idPermiso !== null) {
    if (ApiWhere.length > 0) {
      ApiWhere += '&id=' + idPermiso
    } else {
      ApiWhere += '?id=' + idPermiso
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
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}
