const API = `${process.env.REACT_APP_API_URL}usuariogrupo`

export function getUsuarioGrupo(idUsuario, IdGrupo, token) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idUsuario !== null) {
    ApiWhere += '/' + idUsuario
  }
  if (IdGrupo !== null) {
    ApiWhere += '/' + IdGrupo
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
    .catch((err) => {
      if (err.message == 'Failed to fetch') {
        alert('Error de conexión. Revise si está conectado a Internet.')
      }
    })
}
