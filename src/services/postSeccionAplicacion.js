const API = `${process.env.REACT_APP_API_URL}seccionaplicacion`

export function postSeccionAplicacion(
  id_seccionaplicacion,
  nombre,
  direccion,
  direccion_movil,
  opcion,
  estado,
  id_usuario,
  token,
) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    nombre: nombre,
    direccion: direccion,
    direccion_movil: direccion_movil,
    activo: estado,
    id_usuario: id_usuario,
  }

  if (id_seccionaplicacion !== '' && opcion !== '') {
    ApiWhere += '/' + id_seccionaplicacion + '/' + opcion
  }
  ApiFinal += ApiWhere

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
