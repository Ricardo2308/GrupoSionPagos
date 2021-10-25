const API = `${process.env.REACT_APP_API_URL}usuarios`

export function postEditarUsuario(
  id,
  nombre,
  apellido,
  email,
  username,
  estado,
  cambiaPassword,
  opcion,
) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id: id,
    nombre: nombre,
    apellido: apellido,
    correo: email,
    nombre_usuario: username,
    activo: estado,
    cambia_password: cambiaPassword,
    opcion: opcion,
  }

  if (id !== '' && opcion !== '') {
    ApiWhere += '/' + id + '/' + opcion
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
