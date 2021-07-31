const API = `${process.env.REACT_APP_BACKEND_URL}post_usuarioperfil.php`

export function postPerfilUsuario(idUsuarioPerfil, idUsuario, perfiles, opcion, idPerfil, estado) {
  var datos = {
    id_usuarioperfil: idUsuarioPerfil,
    id_usuario: idUsuario,
    perfiles: perfiles,
    opcion: opcion,
    perfil_crud: idPerfil,
    estado: estado,
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
