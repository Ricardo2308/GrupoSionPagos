const API = `${process.env.REACT_APP_API_URL}cuentagrupoautorizacion`

export function getCuentaGrupoAutorizacion(idCuentaGrupoAutorizacion, token) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idCuentaGrupoAutorizacion !== null) {
    ApiWhere += '/' + idCuentaGrupoAutorizacion
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
