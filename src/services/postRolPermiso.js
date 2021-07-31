const API = `${process.env.REACT_APP_BACKEND_URL}post_rolpermiso.php`

export function postRolPermiso(idRolPermiso, idRol, permisos, opcion, idPermiso, estado) {
  var datos = {
    id_rolpermiso: idRolPermiso,
    id_rol: idRol,
    permisos: permisos,
    opcion: opcion,
    permiso_crud: idPermiso,
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
