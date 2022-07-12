const API = `${process.env.REACT_APP_API_URL}notificaciontipodocumentolote`

export function postCrudNotificacionTipoDocumentoLote(
  id_notificaciontipodocumentolote,
  id_usuarionotificaciontransaccion,
  id_tipodocumentolote,
  opcion,
  id_usuario,
  token,
) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_notificaciontipodocumentolote: id_notificaciontipodocumentolote,
    opcion: opcion,
    idUsuario: id_usuario,
    id_usuarionotificaciontransaccion: id_usuarionotificaciontransaccion,
    id_tipodocumentolote: id_tipodocumentolote,
  }

  if (id_notificaciontipodocumentolote !== '' && opcion !== '') {
    ApiWhere += '/' + id_notificaciontipodocumentolote + '/' + opcion
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
