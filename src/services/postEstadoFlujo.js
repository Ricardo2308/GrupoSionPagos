const API = `${process.env.REACT_APP_BACKEND_URL}post_estadoflujo.php`

export function postEstadoFlujo(idEstado, idEstadoPadre, descripcion, estado, opcion) {
  var datos = {
    id_estadoflujo: idEstado,
    id_estadoflujopadre: idEstadoPadre,
    descripcion: descripcion,
    estado: estado,
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
