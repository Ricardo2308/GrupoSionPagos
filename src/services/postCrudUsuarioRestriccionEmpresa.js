const API = `${process.env.REACT_APP_API_URL}usuariorestriccionempresa`

export function postCrudUsuarioRestriccionEmpresa(
  idUsuarioRestriccionEmpresa,
  id_usuario,
  empresa_codigo,
  empresa_nombre,
  opcion,
  id_usuario_s,
  token,
) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_usuariorestriccionempresa: idUsuarioRestriccionEmpresa,
    opcion: opcion,
    id_usuario: id_usuario,
    empresa_codigo: empresa_codigo,
    empresa_nombre: empresa_nombre,
    id_usuario_s: id_usuario_s,
  }

  if (idUsuarioRestriccionEmpresa !== '' && opcion !== '') {
    ApiWhere += '/' + idUsuarioRestriccionEmpresa + '/' + opcion
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
