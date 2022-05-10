const API = `${process.env.REACT_APP_API_URL}cuentagrupoautorizacion`

export function postCrudCuentaGrupoAutorizacion(
  idCuentaGrupoAutorizacion,
  id_grupoautorizacion,
  CodigoCuenta,
  opcion,
  id_usuario,
  token,
) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_cuentagrupo: idCuentaGrupoAutorizacion,
    opcion: opcion,
    id_usuario: id_usuario,
    CodigoCuenta: CodigoCuenta,
    id_grupoautorizacion: id_grupoautorizacion,
  }

  if (idCuentaGrupoAutorizacion !== '' && opcion !== '') {
    ApiWhere += '/' + idCuentaGrupoAutorizacion + '/' + opcion
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
