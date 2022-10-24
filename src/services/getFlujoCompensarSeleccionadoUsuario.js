const API = `${process.env.REACT_APP_API_URL}flujocompensarseleccionado`

export function getFlujoCompensarSeleccionadoUsuario(id_usuario, token) {
  let ApiFinal = API + '/' + id_usuario
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
