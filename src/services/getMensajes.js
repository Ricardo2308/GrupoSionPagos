const API = `${process.env.REACT_APP_API_URL}mensajes`

export function getMensajes(idUsuarioEnvia, idUsuarioRecibe) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idUsuarioEnvia !== null) {
    ApiWhere += '/' + idUsuarioEnvia
  }
  if (idUsuarioRecibe !== null) {
    ApiWhere += '/' + idUsuarioRecibe
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((err) => {
      if (err.message === 'Timeout' || err.message === 'Network request failed') {
        // retry
      } else {
        throw err // rethrow other unexpected errors
      }
    })
}
