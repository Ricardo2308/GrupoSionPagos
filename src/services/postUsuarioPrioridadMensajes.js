const API = `${process.env.REACT_APP_API_URL}usuarioprioridadmensajes`

export function postUsuarioPrioridadMensajes(
  id_usuarioprioridadmensajes,
  id_usuario,
  id_usuario_prioridad,
  nivel,
  opcion,
  estado,
  id_usuario_s,
  token,
) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_usuario: id_usuario,
    id_usuario_prioridad: id_usuario_prioridad,
    nivel: nivel,
    activo: estado,
    id_usuario_s: id_usuario_s,
  }

  if (id_usuarioprioridadmensajes !== '' && opcion !== '') {
    ApiWhere += '/' + id_usuarioprioridadmensajes + '/' + opcion
  }
  ApiFinal += ApiWhere

  const data = JSON.stringify(datos)
  return fetch(ApiFinal, {
    method: 'POST',
    body: data,
    headers: {
      Authorization: 'Bearer ' + token,
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
