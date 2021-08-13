const API = `${process.env.REACT_APP_API_URL}flujos`

export function getFlujos(idFlujo, Tipo) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idFlujo !== null) {
    ApiWhere += '/' + idFlujo + '/0'
  }
  if (Tipo !== null) {
    ApiWhere += '/0/' + Tipo
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((err) => err)
}
