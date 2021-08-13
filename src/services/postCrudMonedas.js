const API = `${process.env.REACT_APP_BACKEND_URL}post_monedas.php`

export function postCrudMonedas(idMoneda, nombre, simbolo, estado, opcion) {
  var datos = {
    id_moneda: idMoneda,
    nombre: nombre,
    simbolo: simbolo,
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
