const API = `${process.env.REACT_APP_API_URL}archivosflujo`

export function getArchivosFlujo(idFlujo, idUsuario) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idFlujo !== null) {
    ApiWhere += '/0/' + idFlujo
  }
  if (idUsuario !== null) {
    ApiWhere += '/' + idUsuario + '/0'
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
