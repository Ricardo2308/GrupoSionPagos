const API = `${process.env.REACT_APP_BACKEND_URL}post_usuariogrupo.php`

export function postUsuarioGrupo(idUsuario, opcion, idGrupo, estado) {
  var datos = {
    id_usuario: idUsuario,
    opcion: opcion,
    id_grupo: idGrupo,
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
