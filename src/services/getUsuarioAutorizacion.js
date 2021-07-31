const API = `${process.env.REACT_APP_BACKEND_URL}get_usuarioautorizacion.php`

export function getUsuarioAutorizacion(idAprobador, idAutorizacion) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idAprobador !== null) {
    if (ApiWhere.length > 0) {
      ApiWhere += '&id_usuario=' + idAprobador
    } else {
      ApiWhere += '?id_usuario=' + idAprobador
    }
  }
  if (idAutorizacion !== null) {
    if (ApiWhere.length > 0) {
      ApiWhere += '&id_usuarioautorizacion=' + idAutorizacion
    } else {
      ApiWhere += '?id_usuarioautorizacion=' + idAutorizacion
    }
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((err) => err)
}
