const API = `${process.env.REACT_APP_API_URL}usuarios`

export function getUsuarios(idGrupo, idFlujo, Nivel, Estado) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idGrupo !== null) {
    ApiWhere += '/' + idGrupo
  }
  if (idFlujo !== null) {
    ApiWhere += '/' + idFlujo
  }
  if (Nivel !== null) {
    ApiWhere += '/' + Nivel
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
