const API = `${process.env.REACT_APP_API_URL}condiciongrupo`

export function getCondicionGrupo(idCondicion, Descripcion) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idCondicion !== null) {
    ApiWhere += '/' + idCondicion
  }
  if (Descripcion !== null) {
    ApiWhere += '/' + Descripcion
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
