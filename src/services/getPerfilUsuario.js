const API = `${process.env.REACT_APP_API_URL}usuarioperfil`

export function getPerfilUsuario(idUsuario, Descripcion) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idUsuario !== null) {
    ApiWhere += '/' + idUsuario
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
