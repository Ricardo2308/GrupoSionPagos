const API = `${process.env.REACT_APP_BACKEND_URL}crear_usuario.php`

export function postCrearUsuario(nombre, apellido, usuario, correo, contra) {
  var datos = {
    nombre: nombre,
    apellido: apellido,
    usuario: usuario,
    email: correo,
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
