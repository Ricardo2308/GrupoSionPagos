const API = `${process.env.REACT_APP_API_URL}grupoautorizacion`

export function getGruposAutorizacion(idGrupo, idGrupoPadre) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idGrupo !== null) {
    ApiWhere += '/' + idGrupo
  }
  if (idGrupoPadre !== null) {
    ApiWhere += '/' + idGrupoPadre
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}
