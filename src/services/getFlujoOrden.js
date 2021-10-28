const API = `${process.env.REACT_APP_API_URL}flujoorden`

export function getFlujoOrden(idFlujo, docNum) {
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
    .catch((err) => {
      if (err.message == 'Failed to fetch') {
        alert('Error de conexión. Revise si está conectado a Internet.')
      }
    })
}
