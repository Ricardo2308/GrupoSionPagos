const API = `${process.env.REACT_APP_BACKEND_URL}mensajes.php`

export function getMensajes(idUsuarioEnvia, idUsuarioRecibe) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idUsuarioEnvia !== null) {
    if (ApiWhere.length > 0) {
      ApiWhere += '&id_usuarioenvia=' + idUsuarioEnvia
    } else {
      ApiWhere += '?id_usuarioenvia=' + idUsuarioEnvia
    }
  }
  if (idUsuarioRecibe !== null) {
    if (ApiWhere.length > 0) {
      ApiWhere += '&id_usuariorecibe=' + idUsuarioRecibe
    } else {
      ApiWhere += '?id_usuariorecibe=' + idUsuarioRecibe
    }
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((err) => err)
}
