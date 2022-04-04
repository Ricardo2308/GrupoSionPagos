const API = `${process.env.REACT_APP_API_URL}cuentas`

export function postCrudCuentas(
  idCuenta,
  numeroCuenta,
  nombre,
  idEmpresa,
  idBanco,
  idMoneda,
  codigoACH,
  opcion,
  id_usuario,
) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_cuenta: idCuenta,
    numero_cuenta: numeroCuenta,
    nombre: nombre,
    id_empresa: idEmpresa,
    id_banco: idBanco,
    id_moneda: idMoneda,
    codigo_ach: codigoACH,
    opcion: opcion,
    id_usuario: id_usuario,
  }

  if (idCuenta !== '' && opcion !== '') {
    ApiWhere += '/' + idCuenta + '/' + opcion
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
