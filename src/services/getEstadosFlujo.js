const API = `${process.env.REACT_APP_BACKEND_URL}estados_flujo.php`

export function getEstadosFlujo(idEstado, descripcion) {
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
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((err) => err)
}
