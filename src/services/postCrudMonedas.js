const API = `${process.env.REACT_APP_API_URL}monedas`

export function postCrudMonedas(idMoneda, nombre, simbolo, estado, opcion) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_moneda: idMoneda,
    nombre: nombre,
    simbolo: simbolo,
    activo: estado,
    opcion: opcion,
  }

  if (idMoneda !== '') {
    ApiWhere += '/' + idMoneda
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
