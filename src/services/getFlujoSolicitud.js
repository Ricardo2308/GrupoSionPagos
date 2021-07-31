const API = `${process.env.REACT_APP_BACKEND_URL}flujo_solicitud.php`

export function getFlujoSolicitud(idFlujo, docNum) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idFlujo !== null) {
    if (ApiWhere.length > 0) {
      ApiWhere += '&id_flujo=' + idFlujo
    } else {
      ApiWhere += '?id_flujo=' + idFlujo
    }
  }
  if (docNum !== null) {
    if (ApiWhere.length > 0) {
      ApiWhere += '&doc_num=' + docNum
    } else {
      ApiWhere += '?doc_num=' + docNum
    }
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((err) => err)
}
