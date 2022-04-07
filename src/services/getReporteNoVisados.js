const API = `${process.env.REACT_APP_API_URL}novisadoreporte`

export function getReporteNoVisados() {
  return fetch(API)
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}
