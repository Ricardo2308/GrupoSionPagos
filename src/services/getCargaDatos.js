const API = `${process.env.REACT_APP_API_URL}cargadatos`

export function getCargaDatos() {
  let ApiFinal = API
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}
