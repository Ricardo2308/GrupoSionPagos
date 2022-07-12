const API = `${process.env.REACT_APP_API_URL}usuarioautorizacion`

export function postUsuarioAutorizacion(
  idAutorizacion,
  idAprobador,
  idTemporal,
  fechaInicio,
  fechaFinal,
  opcion,
  estado,
  id_usuario,
  token,
) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_usuarioautorizacion: idAutorizacion,
    id_usuarioaprobador: idAprobador,
    id_usuariotemporal: idTemporal,
    fecha_inicio: fechaInicio,
    fecha_final: fechaFinal,
    opcion: opcion,
    activo: estado,
    id_usuario: id_usuario,
  }

  if (idAutorizacion !== '' && opcion !== '') {
    ApiWhere += '/' + idAutorizacion + '/' + opcion
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
