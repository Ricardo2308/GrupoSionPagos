const API = `${process.env.REACT_APP_BACKEND_URL}archivos_flujo.php`

export function getArchivosFlujo(idFlujo, idUsuario) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idFlujo !== null) {
    if (ApiWhere.length > 0) {
      ApiWhere += '&id_flujo=' + idFlujo
    } else {
      ApiWhere += '?id_flujo=' + idFlujo
    }
  }
  if (idUsuario !== null) {
    if (ApiWhere.length > 0) {
      ApiWhere += '&id_usuario=' + idUsuario
    } else {
      ApiWhere += '?id_usuario=' + idUsuario
    }
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((err) => err)
}
