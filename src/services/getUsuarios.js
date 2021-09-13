const API = `${process.env.REACT_APP_API_URL}usuarios`

export function getUsuarios(idGrupo, Nivel, Correo, Password) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idGrupo !== null) {
    ApiWhere += '/' + idGrupo
  }
  if (Nivel !== null) {
    ApiWhere += '/' + Nivel
  }
  if (Correo !== null) {
    ApiWhere += '/' + Correo
  }
  if (Password !== null) {
    ApiWhere += '/' + Password
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((err) => err)
}
