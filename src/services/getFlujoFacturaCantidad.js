const API = `${process.env.REACT_APP_API_URL}flujofacturacantidad`

export function getFlujoFacturaCantidad(idFlujo) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idFlujo !== null) {
    ApiWhere += '/' + idFlujo
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}
