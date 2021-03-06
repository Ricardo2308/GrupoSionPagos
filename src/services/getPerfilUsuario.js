const API = `${process.env.REACT_APP_API_URL}usuarioperfil`

export function getPerfilUsuario(idUsuario, opcion, objeto) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idUsuario !== null) {
    ApiWhere += '/' + idUsuario
  }
  if (objeto !== null) {
    ApiWhere += '/' + objeto
  }
  if (opcion !== null) {
    ApiWhere += '/' + opcion
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}
