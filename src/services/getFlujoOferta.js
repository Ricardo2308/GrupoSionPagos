const API = `${process.env.REACT_APP_API_URL}flujooferta`

export function getFlujoOferta(idFlujo, docNum) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idFlujo !== null) {
    ApiWhere += '/' + idFlujo
  }
  if (docNum !== null) {
    ApiWhere += '/' + docNum
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((err) => err)
}
