const API = `${process.env.REACT_APP_BACKEND_URL}get_usuarioperfil.php`

export function getPerfilUsuario(idUsuario, Descripcion) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idUsuario !== null) {
    if (ApiWhere.length > 0) {
      ApiWhere += '&id_usuario=' + idUsuario
    } else {
      ApiWhere += '?id_usuario=' + idUsuario
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
