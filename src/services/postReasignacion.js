const API = `${process.env.REACT_APP_API_URL}reasignacion`

export function postReasignacion(id_flujo, id_grupoautorizacion, id_usuario, token) {
  let ApiFinal = API

  var datos = {
    id_flujo: id_flujo,
    id_grupoautorizacion: id_grupoautorizacion,
    id_usuario: id_usuario,
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
