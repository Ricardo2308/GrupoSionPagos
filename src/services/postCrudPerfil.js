const API = `${process.env.REACT_APP_API_URL}perfiles`

export function postCrudPerfil(idPerfil, descripcion, estado, opcion) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_perfil: idPerfil,
    descripcion: descripcion,
    activo: estado,
    opcion: opcion,
  }

  if (idPerfil !== '' && opcion !== '') {
    ApiWhere += '/' + idPerfil + '/' + opcion
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
