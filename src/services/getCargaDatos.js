const API = `${process.env.REACT_APP_API_URL}cargadatos`

export function getCargaDatos(token) {
  let ApiFinal = API
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
