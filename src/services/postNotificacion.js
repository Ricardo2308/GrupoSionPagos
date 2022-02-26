const API = `${process.env.REACT_APP_API_URL}notificacion`

export function postNotificacion(pagos, idUsuario, mensaje, opcion) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    pagos: pagos,
    IdUsuario: idUsuario,
    Mensaje: mensaje,
  }

  if (opcion !== '') {
    ApiWhere += '/' + opcion
  }
  ApiFinal += ApiWhere

  const data = JSON.stringify(datos)
  return fetch(ApiFinal, {
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
