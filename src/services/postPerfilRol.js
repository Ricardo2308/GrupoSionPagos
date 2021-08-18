const API = `${process.env.REACT_APP_API_URL}perfilrol`

export function postPerfilRol(idPerfilRol, idPerfil, roles, opcion, idRol, estado) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_perfilrol: idPerfilRol,
    id_perfil: idPerfil,
    roles: roles,
    opcion: opcion,
    id_rol: idRol,
    activo: estado,
  }

  if (roles !== '') {
    ApiWhere += '/' + roles
  }
  if (idPerfilRol !== '' && opcion !== '') {
    ApiWhere += '/' + idPerfilRol + '/' + opcion
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
