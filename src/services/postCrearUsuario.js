const API = `${process.env.REACT_APP_API_URL}usuarios`

export function postCrearUsuario(
  nombre,
  apellido,
  usuario,
  correo,
  password,
  cambiaPassword,
  id_usuario,
) {
  var datos = {
    nombre: nombre,
    apellido: apellido,
    nombre_usuario: usuario,
    correo: correo,
    password: password,
    cambia_password: cambiaPassword,
    id_usuario: id_usuario,
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
