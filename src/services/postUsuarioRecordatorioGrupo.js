const API = `${process.env.REACT_APP_API_URL}usuariorecordatoriogrupo`

export function postUsuarioRecordatorioGrupo(
  id_usuariorecordatoriogrupo,
  id_usuario_emisor,
  id_usuario_receptor,
  id_grupoautorizacion,
  opcion,
  estado,
  id_usuario_s,
  token,
) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_usuario_emisor: id_usuario_emisor,
    id_usuario_receptor: id_usuario_receptor,
    id_grupoautorizacion: id_grupoautorizacion,
    activo: estado,
    id_usuario_s: id_usuario_s,
  }

  if (id_usuariorecordatoriogrupo !== '' && opcion !== '') {
    ApiWhere += '/' + id_usuariorecordatoriogrupo + '/' + opcion
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
