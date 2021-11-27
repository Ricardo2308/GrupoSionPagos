const API = `${process.env.REACT_APP_API_URL}pendientesvalidacionreporte`

export function getPendientesValidacionReporte() {
  return fetch(API)
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}
