const API = `${process.env.REACT_APP_BACKEND_URL}post_politicas.php`

export function postCrudPoliticas(idPolitica, descripcion, identificador, valor, estado, opcion) {
  var datos = {
    id_politica: idPolitica,
    descripcion: descripcion,
    identificador: identificador,
    valor: valor,
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
