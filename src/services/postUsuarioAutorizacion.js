const API = `${process.env.REACT_APP_BACKEND_URL}post_usuarioautorizacion.php`

export function postUsuarioAutorizacion(
  idAutorizacion,
  idAprobador,
  idTemporal,
  fechaInicio,
  fechaFinal,
  opcion,
  estado,
) {
  var datos = {
    id_usuarioautorizacion: idAutorizacion,
    id_aprobador: idAprobador,
    id_temporal: idTemporal,
    fechainicio: fechaInicio,
    fechafinal: fechaFinal,
    opcion: opcion,
    estado: estado,
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
