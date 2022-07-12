const API = `${process.env.REACT_APP_API_URL}recordatoriousuario`

export function postRecordatorioUsuario(
  id_recordatoriousuario,
  opcion,
  estado,
  id_usuario,
  id_flujo,
  token,
) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_recordatoriousuario: id_recordatoriousuario,
    opcion: opcion,
    activo: estado,
    id_usuario: id_usuario,
    id_flujo: id_flujo,
  }

  if (id_recordatoriousuario !== '' && opcion !== '') {
    ApiWhere += '/' + id_recordatoriousuario + '/' + opcion
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
