const API = `${process.env.REACT_APP_API_URL}restriccionempresa`

export function postCrudRestriccionEmpresa(
  idRestriccionEmpresa,
  empresa_codigo,
  empresa_nombre,
  opcion,
  id_usuario,
) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_restriccionempresa: idRestriccionEmpresa,
    opcion: opcion,
    id_usuario: id_usuario,
    empresa_codigo: empresa_codigo,
    empresa_nombre: empresa_nombre,
  }

  if (idRestriccionEmpresa !== '' && opcion !== '') {
    ApiWhere += '/' + idRestriccionEmpresa + '/' + opcion
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
