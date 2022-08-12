const API = `${process.env.REACT_APP_API_URL}usuariosinnotificacioncorreo`

export function postUsuarioSinNotificacionCorreo(
  id_usuariosinnotificacioncorreo,
  id_usuario,
  id_tiponotificacion,
  opcion,
  estado,
  id_usuario_s,
  token,
) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_usuario: id_usuario,
    id_tiponotificacion: id_tiponotificacion,
    activo: estado,
    id_usuario_s: id_usuario_s,
  }

  if (id_usuariosinnotificacioncorreo !== '' && opcion !== '') {
    ApiWhere += '/' + id_usuariosinnotificacioncorreo + '/' + opcion
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
