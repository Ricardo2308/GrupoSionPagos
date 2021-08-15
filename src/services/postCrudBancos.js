const API = `${process.env.REACT_APP_API_URL}bancos`

export function postCrudBancos(idBanco, nombre, direccion, estado, opcion) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_banco: idBanco,
    nombre: nombre,
    direccion: direccion,
    activo: estado,
    opcion: opcion,
  }

  if (idBanco !== '' && opcion !== '') {
    ApiWhere += '/' + idBanco + '/' + opcion
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
