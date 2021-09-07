const API = `${process.env.REACT_APP_API_URL}flujos`

export function postFlujos(idFlujo, nivel) {
  var datos = {
    id_flujo: idFlujo,
    nivel: nivel,
  }

  const data = JSON.stringify(datos)
  return fetch(API, {
    method: 'POST',
    body: data,
    headers: {
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
