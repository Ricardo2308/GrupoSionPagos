const API = `${process.env.REACT_APP_API_URL}usuarios`

export function getUsuarios(idGrupo, idFlujo, Usuario, Estado, token) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idGrupo !== null) {
    ApiWhere += '/' + idGrupo
  }
  if (idFlujo !== null) {
    ApiWhere += '/' + idFlujo
  }
  if (Usuario !== null) {
    ApiWhere += '/' + Usuario
  }
  if (Estado !== null) {
    ApiWhere += '/' + Estado
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
    },
  })
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}
