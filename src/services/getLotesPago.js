const API = `${process.env.REACT_APP_API_URL}lotes`

export function getLotesPago(Tipo, token) {
  let ApiFinal = API
  let ApiWhere = '/' + Tipo
  ApiFinal += ApiWhere
  return fetch(ApiFinal, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
    },
  })
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}
