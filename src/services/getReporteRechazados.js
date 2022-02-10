const API = `${process.env.REACT_APP_API_URL}rechazadosreporte`

export function getReporteRechazados() {
  return fetch(API)
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}
