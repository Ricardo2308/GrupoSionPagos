const API = `${process.env.REACT_APP_API_URL}bancos`

export function getBancos(idBanco, Nombre) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idBanco !== null) {
    ApiWhere += '/' + idBanco
  }
  if (Nombre !== null) {
    ApiWhere += '/' + Nombre
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((err) => {
      if (err.message == 'Failed to fetch') {
        alert('Error de conexión. Revise si está conectado a Internet.')
      }
    })
}
