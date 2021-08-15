const API = `${process.env.REACT_APP_API_URL}roles`

export function postCrudRoles(idRol, descripcion, objeto, estado, opcion) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_rol: idRol,
    descripcion: descripcion,
    objeto: objeto,
    activo: estado,
    opcion: opcion,
  }

  if (idRol !== '' && opcion !== '') {
    ApiWhere += '/' + idRol + '/' + opcion
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
