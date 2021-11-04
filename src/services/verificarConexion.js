const API = `${process.env.REACT_APP_API_URL}estoyconectado`

export function verificarConexion(IdUsuario) {
  let ApiFinal = API
  let ApiWhere = ''
  if (IdUsuario !== null) {
    ApiWhere += '/' + IdUsuario
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}
