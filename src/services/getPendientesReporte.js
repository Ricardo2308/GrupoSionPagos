const API = `${process.env.REACT_APP_API_URL}pendientesreporte`

export function getPendientesReporte() {
  return fetch(API)
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}
