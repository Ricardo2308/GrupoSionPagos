const API = `${process.env.REACT_APP_API_URL}usuariosporgrupo`

export function getUsuariosPorGrupoSegunUsuario(idUsuario, idGrupo, token) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idUsuario !== null) {
    ApiWhere += '/' + idUsuario
  }
  if (idGrupo !== null) {
    ApiWhere += '/' + idGrupo
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
