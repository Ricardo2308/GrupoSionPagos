const API = `${process.env.REACT_APP_BACKEND_URL}postmensajes.php`

export function postMensajes(idFlujo, idUsuarioEnvia, idUsuarioRecibe, mensaje, opcion) {
  var datos = {
    id_flujo: idFlujo,
    id_usuarioenvia: idUsuarioEnvia,
    id_usuariorecibe: idUsuarioRecibe,
    mensaje: mensaje,
    opcion: opcion,
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
