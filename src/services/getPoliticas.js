const API = `${process.env.REACT_APP_API_URL}politicas`

export function getPoliticas(idPolitica, Descripcion) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idPolitica !== null) {
    if (ApiWhere.length > 0) {
      ApiWhere += '&id_politica=' + idPolitica
    } else {
      ApiWhere += '?id_politica=' + idPolitica
    }
  }
  if (Descripcion !== null) {
    if (ApiWhere.length > 0) {
      ApiWhere += '&descripcion=' + Descripcion
    } else {
      ApiWhere += '?descripcion=' + Descripcion
    }
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
