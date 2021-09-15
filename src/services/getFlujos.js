const API = `${process.env.REACT_APP_API_URL}flujos`

export function getFlujos(idFlujo, Tipo, idUsuario, opcion) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idFlujo !== null && opcion !== null) {
    ApiWhere += '/' + opcion + '/' + idFlujo
  }
  if (Tipo !== null) {
    ApiWhere += '/0/' + Tipo + '/' + idUsuario
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((err) => err)
}
