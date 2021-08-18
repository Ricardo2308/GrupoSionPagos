const API = `${process.env.REACT_APP_API_URL}mensajes`

export function postMensajes(idFlujo, idUsuarioEnvia, idUsuarioRecibe, mensaje, opcion) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_flujo: idFlujo,
    id_usuarioenvia: idUsuarioEnvia,
    id_usuariorecibe: idUsuarioRecibe,
    mensaje: mensaje,
    opcion: opcion,
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
