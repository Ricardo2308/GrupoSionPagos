const API = `${process.env.REACT_APP_API_URL}flujos`

export function getFlujos(idFlujo, Tipo, idUsuario, opcion) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idFlujo !== null) {
    ApiWhere += '/' + idFlujo + '/0/' + idUsuario
  }
  if (Tipo !== null) {
    ApiWhere += '/0/' + Tipo + '/' + idUsuario
  }
  if (opcion !== null) {
    ApiWhere += '/' + opcion
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((err) => err)
}
