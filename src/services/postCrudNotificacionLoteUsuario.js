const API = `${process.env.REACT_APP_API_URL}usuarionotificaciontransaccion`

export function postCrudNotificacionLoteUsuario(
  id_usuarionotificaciontransaccion,
  id_usuario,
  TipoTransaccion,
  opcion,
  idUsuario,
  ConfiguracionDocumentos,
) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_usuarionotificaciontransaccion: id_usuarionotificaciontransaccion,
    opcion: opcion,
    id_usuario: id_usuario,
    TipoTransaccion: TipoTransaccion,
    idUsuario: idUsuario,
    ConfiguracionDocumentos: ConfiguracionDocumentos,
  }

  if (id_usuarionotificaciontransaccion !== '' && opcion !== '') {
    ApiWhere += '/' + id_usuarionotificaciontransaccion + '/' + opcion
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
