const API = `${process.env.REACT_APP_API_URL}flujos`

export function getFlujos(idFlujo, Tipo, idUsuario, opcion, year, mes) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idFlujo !== null && opcion !== null && year !== null && mes !== null) {
    ApiWhere += '/' + opcion + '/' + idFlujo + '/' + year + '/' + mes
  }
  if (Tipo !== null && idUsuario !== null && opcion !== null) {
    ApiWhere += '/' + Tipo + '/' + idUsuario + '/' + opcion
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((err) => err)
}
