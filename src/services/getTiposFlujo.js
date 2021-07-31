const API = `${process.env.REACT_APP_BACKEND_URL}tipos_flujo.php`

export function getTiposFlujo(idTipo, descripcion) {
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
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((err) => err)
}
