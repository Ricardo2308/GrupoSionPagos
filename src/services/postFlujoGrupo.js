const API = `${process.env.REACT_APP_API_URL}flujogrupo`

export function postFlujoGrupo(idFlujoGrupo, idFlujo, idGrupo, idUsuario, estado, opcion) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_flujogrupo: idFlujoGrupo,
    id_flujo: idFlujo,
    id_grupoautorizacion: idGrupo,
    id_usuario: idUsuario,
    activo: estado,
    opcion: opcion,
  }

  if (idFlujoGrupo !== '' && opcion !== '') {
    ApiWhere += '/' + idFlujoGrupo + '/' + opcion
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
