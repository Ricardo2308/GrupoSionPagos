const API = `${process.env.REACT_APP_API_URL}grupoautorizacion`

export function postGruposAutorizacion(
  idGrupo,
  identificador,
  descripcion,
  numeroNiveles,
  estado,
  opcion,
  id_usuario,
) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_grupo: idGrupo,
    identificador: identificador,
    descripcion: descripcion,
    numero_niveles: numeroNiveles,
    activo: estado,
    opcion: opcion,
    id_usuario: id_usuario,
  }

  if (idGrupo !== '' && opcion !== '') {
    ApiWhere += '/' + idGrupo + '/' + opcion
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
