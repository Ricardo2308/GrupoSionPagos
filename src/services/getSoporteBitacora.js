const API = `${process.env.REACT_APP_API_URL}soportebitacora`

export function getSoporteBitacora(inicio, fin, id) {
  let ApiFinal = API
  let ApiWhere = ''
  if (inicio !== null) {
    ApiWhere += '/' + inicio + '/' + fin
  }
  if (id !== null) {
    ApiWhere += '/' + id
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}
