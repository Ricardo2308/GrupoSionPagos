const API = `${process.env.REACT_APP_API_URL}postflujos`

export function postFlujosCompensar(idFlujo, nivel, id_grupo, opcion, pagos, IdUsuario, token) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_flujo: idFlujo,
    nivel: nivel,
    id_grupoautorizacion: id_grupo,
    opcion: opcion,
    pagos: pagos,
    id_usuario: IdUsuario,
  }

  ApiFinal += '/' + idFlujo

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
