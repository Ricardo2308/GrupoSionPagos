const API = `${process.env.REACT_APP_API_URL}usuarioautorizacion`

export function getUsuarioAutorizacion(idAprobador, idAutorizacion) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idAprobador !== null) {
    ApiWhere += '/' + idAprobador
  }
  if (idAutorizacion !== null) {
    ApiWhere += '/' + idAutorizacion
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
