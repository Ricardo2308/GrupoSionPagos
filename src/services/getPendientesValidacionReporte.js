const API = `${process.env.REACT_APP_API_URL}pendientesvalidacionreporte`

export function getPendientesValidacionReporte(token) {
  return fetch(API, {
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
