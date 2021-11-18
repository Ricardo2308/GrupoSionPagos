const API = `${process.env.REACT_APP_API_URL}mensajeschat`

export function getMensajesChat(idPago) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idPago !== null) {
    ApiWhere += '/' + idPago
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}
