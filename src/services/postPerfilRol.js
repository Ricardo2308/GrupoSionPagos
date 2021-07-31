const API = `${process.env.REACT_APP_BACKEND_URL}post_perfilrol.php`

export function postPerfilRol(idPerfilRol, idPerfil, roles, opcion, idRol, estado) {
  var datos = {
    id_perfilrol: idPerfilRol,
    id_perfil: idPerfil,
    roles: roles,
    opcion: opcion,
    rol_crud: idRol,
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
