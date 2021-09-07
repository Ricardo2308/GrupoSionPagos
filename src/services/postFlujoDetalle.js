const API = `${process.env.REACT_APP_API_URL}flujodetalle`

export function postFlujoDetalle(idFlujo, idEstadoFlujo, idUsuario, Comentario, NivelAutorizo) {
  var datos = {
    IdFlujo: idFlujo,
    IdEstadoFlujo: idEstadoFlujo,
    IdUsuario: idUsuario,
    Comentario: Comentario,
    NivelAutorizo: NivelAutorizo,
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
