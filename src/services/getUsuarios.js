const API = `${process.env.REACT_APP_API_URL}usuarios`

export function getUsuarios(idGrupo, idFlujo, Usuario, Estado) {
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
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((err) => err)
}
