const API = `${process.env.REACT_APP_API_URL}perfilrol`

export function getPerfilRol(idPerfil, Descripcion) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idPerfil !== null) {
    ApiWhere += '/' + idPerfil
  }
  if (Descripcion !== null) {
    ApiWhere += '/' + Descripcion
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((err) => err)
}
