const API = `${process.env.REACT_APP_API_URL}grupoautorizacion`

export function getGruposAutorizacion(idGrupo, idGrupoPadre, token) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idGrupo !== null) {
    ApiWhere += '/' + idGrupo
  }
  if (idGrupoPadre !== null) {
    ApiWhere += '/' + idGrupoPadre
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
