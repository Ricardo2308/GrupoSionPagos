const API = `${process.env.REACT_APP_BACKEND_URL}flujos.php`

export function getFlujos(idFlujo, idTipoFlujo) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idFlujo !== null) {
    if (ApiWhere.length > 0) {
      ApiWhere += '&id_flujo=' + idFlujo
    } else {
      ApiWhere += '?id_flujo=' + idFlujo
    }
  }
  if (idTipoFlujo !== null) {
    if (ApiWhere.length > 0) {
      ApiWhere += '&id_tipoflujo=' + idTipoFlujo
    } else {
      ApiWhere += '?id_tipoflujo=' + idTipoFlujo
    }
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((err) => err)
}
