const API = `${process.env.REACT_APP_API_URL}usuarios`

export function postCrearUsuario(nombre, apellido, usuario, correo, contra) {
  var datos = {
    nombre: nombre,
    apellido: apellido,
    nombre_usuario: usuario,
    correo: correo,
    password: contra,
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
