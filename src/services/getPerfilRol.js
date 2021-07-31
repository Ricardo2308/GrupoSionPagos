const API = `${process.env.REACT_APP_BACKEND_URL}get_perfilrol.php`

export function getPerfilRol(idPerfil, Descripcion) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idPerfil !== null) {
    if (ApiWhere.length > 0) {
      ApiWhere += '&id_perfil=' + idPerfil
    } else {
      ApiWhere += '?id_perfil=' + idPerfil
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
