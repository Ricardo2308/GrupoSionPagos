const API = `${process.env.REACT_APP_API_URL}canceladosreporte`

export function getReporteCancelados() {
  return fetch(API)
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}
