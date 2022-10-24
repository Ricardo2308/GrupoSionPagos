const API = `${process.env.REACT_APP_API_URL}flujocompensarseleccionado`

export function postFlujoCompensarSeleccionado(id_usuario, id_flujo, token) {
  let ApiFinal = API + '/' + id_usuario

  var datos = {
    id_usuario,
    id_flujo,
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
    .then((response) => response.json())
    .then((response) => {
      return response
    })
    .catch((error) => error)
}
