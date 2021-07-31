const API = `${process.env.REACT_APP_BACKEND_URL}get_usuariogrupo.php`

export function getUsuarioGrupo(idUsuario, IdGrupo) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idUsuario !== null) {
    if (ApiWhere.length > 0) {
      ApiWhere += '&id_usuario=' + idUsuario
    } else {
      ApiWhere += '?id_usuario=' + idUsuario
    }
  }
  if (IdGrupo !== null) {
    if (ApiWhere.length > 0) {
      ApiWhere += '&descripcion=' + IdGrupo
    } else {
      ApiWhere += '?descripcion=' + IdGrupo
    }
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((err) => err)
}
