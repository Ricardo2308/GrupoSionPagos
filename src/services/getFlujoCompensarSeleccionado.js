const API = `${process.env.REACT_APP_API_URL}flujocompensarseleccionado`

export function getFlujoCompensarSeleccionado(id_usuario, id_flujo, token) {
  let ApiFinal = API + '/' + id_usuario + '/' + id_flujo
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
