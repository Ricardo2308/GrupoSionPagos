const API = 'http://sionpagos.pendrogon.com/adminpagos-service/administradores.php'

export function getAdministradores(idUsuario, Descripcion) {
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
    .catch((err) => {
      if (err.message == 'Failed to fetch') {
        alert('Error de conexión. Revise si está conectado a Internet.')
      }
    })
}
