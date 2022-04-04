const API = `${process.env.REACT_APP_API_URL}lotes`

export function getLotesPago(Tipo) {
  let ApiFinal = API
  let ApiWhere = '/' + Tipo
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}
