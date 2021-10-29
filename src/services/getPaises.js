const API = `${process.env.REACT_APP_API_URL}paises`

export function getPaises(IdPais, Nombre) {
  let ApiFinal = API
  let ApiWhere = ''
  if (IdPais !== null) {
    ApiWhere += '/' + IdPais
  }
  if (Nombre !== null) {
    ApiWhere += '/' + Nombre
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}
