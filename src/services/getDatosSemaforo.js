const API = `${process.env.REACT_APP_API_URL}semaforo`

export function getDatosSemaforo(idUsuario, token) {
  let ApiFinal = API

  var datos = {
    id_usuario: idUsuario,
  }
  const data = JSON.stringify(datos)

  return fetch(ApiFinal, {
    method: 'POST',
    body: data,
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-type': 'application/json;charset=UTF-8',
    },
  })
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}