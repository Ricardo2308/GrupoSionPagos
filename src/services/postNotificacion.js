const API = `${process.env.REACT_APP_API_URL}notificacion`

export function postNotificacion(idFlujo, idUsuario, mensaje, idGrupo) {
  var datos = {
    IdFlujo: idFlujo,
    IdUsuario: idUsuario,
    Mensaje: mensaje,
    IdGrupo: idGrupo,
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
