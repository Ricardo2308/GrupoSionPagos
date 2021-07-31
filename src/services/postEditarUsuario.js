const API = `${process.env.REACT_APP_BACKEND_URL}editar_usuario.php`

export function postEditarUsuario(id, nombre, apellido, email, password, username, estado, opcion) {
  var datos = {
    id: id,
    nombre: nombre,
    apellido: apellido,
    email: email,
    password: password,
    usuario: username,
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
