const API = `${process.env.REACT_APP_BACKEND_URL}get_condiciongrupo.php`

export function getCondicionGrupo(idCondicion, Descripcion) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idCondicion !== null) {
    if (ApiWhere.length > 0) {
      ApiWhere += '&id_condicion=' + idCondicion
    } else {
      ApiWhere += '?id_condicion=' + idCondicion
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
