const API = `${process.env.REACT_APP_API_URL}condiciongrupo`

export function postCondicionGrupo(idCondicionGrupo, idCondicion, grupos, opcion, idGrupo, estado) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_condiciongrupo: idCondicionGrupo,
    id_condicionautorizacion: idCondicion,
    grupos: grupos,
    opcion: opcion,
    id_grupoautorizacion: idGrupo,
    activo: estado,
  }

  if (grupos !== '') {
    ApiWhere += '/' + grupos
  }
  if (idCondicionGrupo !== '' && opcion !== '') {
    ApiWhere += '/' + idCondicionGrupo + '/' + opcion
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
