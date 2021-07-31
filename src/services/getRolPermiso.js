const API = `${process.env.REACT_APP_BACKEND_URL}get_rolpermiso.php`

export function getRolPermiso(idRol, Descripcion) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idRol !== null) {
    if (ApiWhere.length > 0) {
      ApiWhere += '&id_rol=' + idRol
    } else {
      ApiWhere += '?id_rol=' + idRol
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
    .catch((err) => err)
}
