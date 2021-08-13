const API = `${process.env.REACT_APP_BACKEND_URL}post_cuentas.php`

export function postCrudCuentas(
  idCuenta,
  numeroCuenta,
  nombre,
  idEmpresa,
  idBanco,
  idMoneda,
  codigoACH,
  opcion,
) {
  var datos = {
    id_cuenta: idCuenta,
    numero_cuenta: numeroCuenta,
    nombre: nombre,
    id_empresa: idEmpresa,
    id_banco: idBanco,
    id_moneda: idMoneda,
    codigo_ach: codigoACH,
    opcion: opcion,
  }
  const data = JSON.stringify(datos)
  return fetch(API, {
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
