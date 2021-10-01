const API = `${process.env.REACT_APP_API_URL}flujos`

export function postFlujos(idFlujo, nivel, id_grupo, opcion, codigo) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_flujo: idFlujo,
    nivel: nivel,
    id_grupoautorizacion: id_grupo,
    opcion: opcion,
    codigo: codigo,
  }

  if (idFlujo !== '' && nivel === '' && id_grupo === '') {
    ApiWhere += '/' + idFlujo
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
