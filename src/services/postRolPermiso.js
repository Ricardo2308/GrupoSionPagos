const API = `${process.env.REACT_APP_API_URL}rolpermiso`

export function postRolPermiso(
  idRolPermiso,
  idRol,
  permisos,
  opcion,
  idPermiso,
  estado,
  id_usuario,
) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_rolpermiso: idRolPermiso,
    id_rol: idRol,
    permisos: permisos,
    opcion: opcion,
    id_permiso: idPermiso,
    activo: estado,
    id_usuario: id_usuario,
  }

  if (permisos !== '') {
    ApiWhere += '/' + permisos
  }
  if (idRolPermiso !== '' && opcion !== '') {
    ApiWhere += '/' + idRolPermiso + '/' + opcion
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
