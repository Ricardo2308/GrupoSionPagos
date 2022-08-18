const API = `${process.env.REACT_APP_API_URL}usuariorestricciontexto`

export function postCrudUsuarioRestriccionTexto(
  idUsuarioRestriccionTexto,
  id_usuario,
  texto,
  opcion,
  id_usuario_s,
  token,
) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_usuariorestricciontexto: idUsuarioRestriccionTexto,
    opcion: opcion,
    id_usuario: id_usuario,
    texto: texto,
    id_usuario_s: id_usuario_s,
  }

  if (idUsuarioRestriccionTexto !== '' && opcion !== '') {
    ApiWhere += '/' + idUsuarioRestriccionTexto + '/' + opcion
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
